import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Storage for the portfolio edited from /admin, in order of preference:
// 1. Upstash Redis, if its env vars are set (Upstash or Vercel KV names)
// 2. Netlify Blobs, when running on Netlify (no configuration needed)
// 3. data/portfolio.json, read-only except in local development

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

interface WorksStore {
  get(): Promise<any[] | null>;
  set(data: any[]): Promise<void>;
}

async function getBlobStore(): Promise<WorksStore | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    // Throws outside Netlify, where no Blobs environment is available
    const store = getStore({ name: 'portfolio', consistency: 'strong' });
    return {
      get: () => store.get(WORKS_KEY, { type: 'json' }),
      set: (data) => store.setJSON(WORKS_KEY, data).then(() => undefined),
    };
  } catch {
    return null;
  }
}

async function getRemoteStore(): Promise<WorksStore | null> {
  if (redis) {
    return {
      get: () => redis.get(WORKS_KEY),
      set: (data) => redis.set(WORKS_KEY, JSON.stringify(data)),
    };
  }
  return getBlobStore();
}

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
    const store = await getRemoteStore();
    if (!store) {
      return NextResponse.json(readLocalWorks());
    }
    const works = await store.get();
    if (!works) {
      const local = readLocalWorks();
      await store.set(local);
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

    const store = await getRemoteStore();
    if (!store) {
      // The deployed filesystem is read-only, so only local dev may write the JSON file
      if (!IS_LOCAL_DEV) {
        return NextResponse.json(
          { error: 'No storage configured (Upstash Redis or Netlify Blobs). Changes cannot be saved.' },
          { status: 503 }
        );
      }
      writeLocalWorks(newWorks);
      return NextResponse.json({ success: true, works: newWorks });
    }

    await store.set(newWorks);
    return NextResponse.json({ success: true, works: newWorks });
  } catch (error) {
    console.error('Error saving works:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
