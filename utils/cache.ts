import { CACHE_MAX_AGE } from "@/constants";
import { repositoriesSchema } from "@/schemas/repository";
import { developersSchema } from "@/schemas/developer";
import { z } from "zod";
import { kv } from "@vercel/kv";

// In dev we don't want to cache anything
const isCacheEnabled = process.env.CACHE_ENABLED !== "false";

const cacheSchema = z.object({
  // Data is either Developers or Repositories
  data: z.union([repositoriesSchema, developersSchema]),
  // The time the data was fetched
  timestamp: z.number(),
});

export type Cache = z.infer<typeof cacheSchema>;

export const setCachedItem = async (key: string, value: Cache) => {
  if (!isCacheEnabled) {
    return;
  }
  console.log("Setting cache for: ", key);
  try {
    await kv.set(key, value, {
      ex: CACHE_MAX_AGE, // Expire after 1 hour
    });
  } catch (error) {
    console.error(`Failed to set cache for ${key}: ${error}`);
  }
};

export const getCachedItem = async (
  key: string
): Promise<Cache["data"] | null> => {
  if (!isCacheEnabled) {
    return null;
  }
  console.log("Getting cache for: ", key);
  try {
    const cachedItem = await kv.get<Cache>(key);
    if (cachedItem) {
      const parsedCachedItem = cacheSchema.parse(cachedItem);
      return parsedCachedItem.data;
    }
  } catch (error) {
    console.error(`Failed to get cache for ${key}: ${error}`);
  }
  return null;
};

export const deleteCachedItem = async (key: string) => {
  console.log("Deleting cache for: ", key);
  try {
    await kv.del(key);
  } catch (error) {
    console.error(`Failed to delete cache for ${key}: ${error}`);
  }
};

export const flushCache = async () => {
  console.log("Flushing cache");
  try {
    await kv.flushall();
  } catch (error) {
    console.error(`Failed to flush cache: ${error}`);
  }
};
