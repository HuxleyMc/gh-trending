import { NextResponse } from "next/server";
import { SPOKEN_LANG } from "@/constants/filters";
import { fetchRepos } from "@/utils/fetchRepos";

// Optinal parameters for since: daily, weekly, monthly
/**
 * @swagger
 * /api/trending:
 *   get:
 *     description: Returns trending repositories
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const spokenLanguage = searchParams.get("spoken_language_code") ?? "en";
  const since = searchParams.get("since") ?? "daily";

  if (!["daily", "weekly", "monthly"].includes(since)) {
    return NextResponse.json({ error: "Invalid since" }, { status: 400 });
  }

  if (!SPOKEN_LANG.some((lang) => lang.code === spokenLanguage)) {
    return NextResponse.json(
      { error: "Invalid spoken language" },
      { status: 400 }
    );
  }

  const repos = await fetchRepos("", since, spokenLanguage);

  return NextResponse.json(repos, {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  });
}
