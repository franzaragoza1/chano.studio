import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Accept both Upstash's own variable names and the Vercel KV / Marketplace ones
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redis: any = null;
try {
  if (REDIS_URL && REDIS_TOKEN) {
    const { Redis } = require('@upstash/redis');
    redis = new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN,
    });
  }
} catch {}

const WORKS_KEY = 'chano_works';
const JSON_PATH = path.join(process.cwd(), 'data', 'portfolio.json');
const IS_LOCAL_DEV = process.env.NODE_ENV === 'development';

function readLocalWorks() {
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeLocalWorks(data: any[]) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// No ADMIN_PASSWORD configured means nobody is authorized
function isAuthorized(req: Request) {
  const adminPass = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get('authorization');
  return Boolean(adminPass) && authHeader === `Bearer ${adminPass}`;
}

export async function GET(req: Request) {
  // The admin login sends its password on GET; reject it here if wrong
  if (req.headers.get('authorization') && !isAuthorized(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    if (!redis) {
      return NextResponse.json(readLocalWorks());
    }
    const works = await redis.get(WORKS_KEY);
    if (!works) {
      const local = readLocalWorks();
      await redis.set(WORKS_KEY, JSON.stringify(local));
      return NextResponse.json(local);
    }
    return NextResponse.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(readLocalWorks(), { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newWorks = await req.json();

    if (!redis) {
      // The deployed filesystem is read-only, so only local dev may write the JSON file
      if (!IS_LOCAL_DEV) {
        return NextResponse.json(
          { error: 'Redis is not configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Changes cannot be saved.' },
          { status: 503 }
        );
      }
      writeLocalWorks(newWorks);
      return NextResponse.json({ success: true, works: newWorks });
    }

    await redis.set(WORKS_KEY, JSON.stringify(newWorks));
    return NextResponse.json({ success: true, works: newWorks });
  } catch (error) {
    console.error('Error saving works:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
