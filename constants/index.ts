export const GITHUB_URL = "https://github.com";

// 30 Mins in seconds in prod and 1 min in dev
const envCacheTime = process.env.CACHE_MAX_AGE;
export const CACHE_MAX_AGE =
  process.env.NODE_ENV === "production"
    ? envCacheTime
      ? parseInt(envCacheTime)
      : 1800
    : 30;
