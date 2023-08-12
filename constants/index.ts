export const GITHUB_URL = "https://github.com";

const devCacheTime = process.env.CACHE_MAX_AGE
  ? parseInt(process.env.CACHE_MAX_AGE)
  : 15;

const envCacheTime = process.env.CACHE_MAX_AGE;
export const CACHE_MAX_AGE =
  process.env.NODE_ENV === "production"
    ? envCacheTime
      ? parseInt(envCacheTime)
      : 1800
    : devCacheTime;
