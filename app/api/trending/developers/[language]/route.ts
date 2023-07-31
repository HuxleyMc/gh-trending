import { fetchDevelopers } from "@/utils/fetchDevelopers";

import { validateLanguage } from "@/utils/validators";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/trending/developers/[language]:
 *  get:
 *   description: Returns trending developers for a given language
 *
 */
export async function GET(
  request: Request,
  { params }: { params: { language: string } }
) {
  const { searchParams } = new URL(request.url);

  const sponsorable = searchParams.get("sponsorable") === "1" ?? false;
  const since = searchParams.get("since") ?? "daily";

  if (!["daily", "weekly", "monthly"].includes(since)) {
    return NextResponse.json({ error: "Invalid since" }, { status: 400 });
  }

  const language = validateLanguage(params.language);

  if (!language) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const developers = await fetchDevelopers(language, since, sponsorable);

  return NextResponse.json(developers, {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  });
}
