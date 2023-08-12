import { flushCache, getCachedItem } from "@/utils/cache";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

// API route for getting some stats about the cache
export async function GET(request: Request) {
  const startTime = performance.now();
  const { searchParams } = new URL(request.url);

  const shouldFlush = searchParams.get("flush") === "true";

  const cacheKey = searchParams.get("cacheKey");

  const preCacheSize = await kv.dbsize();

  const cachedItem = cacheKey ? await getCachedItem(cacheKey) : undefined;

  if (shouldFlush) {
    await flushCache();
  }

  const cacheSize = shouldFlush ? 0 : await kv.dbsize();

  const runTime = `${performance.now() - startTime}ms`;

  return NextResponse.json({
    runTime,
    cacheStats: {
      preCacheSize,
      cacheSize,
      cacheDiff: preCacheSize - cacheSize,
    },
    helpersRun: {
      flushCache: shouldFlush,
    },
    cachedItem,
  });
}
