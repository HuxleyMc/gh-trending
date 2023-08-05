import { validateLanguage } from "@/utils/validators";
import { NextResponse } from "next/server";

import { SPOKEN_LANG } from "@/constants/filters";
import { fetchRepos } from "@/utils/fetchRepos";
import { getCacheHeaders } from "@/utils";

export async function GET(
  request: Request,
  { params }: { params: { language: string } }
) {
  const { searchParams } = new URL(request.url);

  const spokenLanguage = searchParams.get("spoken_language_code") ?? "en";
  const since = searchParams.get("since") ?? "daily";

  const language = validateLanguage(params.language);

  if (!language) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  if (!["daily", "weekly", "monthly"].includes(since)) {
    return NextResponse.json({ error: "Invalid since" }, { status: 400 });
  }

  if (!SPOKEN_LANG.some((lang) => lang.code === spokenLanguage)) {
    return NextResponse.json(
      { error: "Invalid spoken language" },
      { status: 400 }
    );
  }

  const repos = await fetchRepos(language, since, spokenLanguage);

  return NextResponse.json(repos, {
    headers: {
      ...getCacheHeaders(),
    },
  });
}
