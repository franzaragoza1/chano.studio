import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import defaultWorks from '@/data/portfolio.json';

// Initialize Redis directly or handle local fallback if no env vars present
// Vercel KV sets UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN automatically
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const WORKS_KEY = 'chano_works';

export async function GET() {
  try {
    if (!redis) {
      console.warn("Redis not configured, returning local JSON");
      return NextResponse.json(defaultWorks);
    }

    const works = await redis.get(WORKS_KEY);
    
    // If empty in database, seed with the default local JSON
    if (!works) {
      await redis.set(WORKS_KEY, JSON.stringify(defaultWorks));
      return NextResponse.json(defaultWorks);
    }

    return NextResponse.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(defaultWorks, { status: 200 }); // fallback
  }
}

export async function POST(req: Request) {
  try {
    // Check for authorization header (simple password check)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!redis) {
      return new NextResponse('Redis not configured', { status: 500 });
    }

    const newWorks = await req.json();
    await redis.set(WORKS_KEY, JSON.stringify(newWorks));

    return NextResponse.json({ success: true, works: newWorks });
  } catch (error) {
    console.error('Error saving works:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
