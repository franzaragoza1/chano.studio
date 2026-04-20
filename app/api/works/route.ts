import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

let redis: any = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis');
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch {}

const WORKS_KEY = 'chano_works';
const JSON_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

function readLocalWorks() {
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeLocalWorks(data: any[]) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
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
    const authHeader = req.headers.get('authorization');
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newWorks = await req.json();

    if (!redis) {
      // Local mode: write directly to portfolio.json
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
