import { getCacheHeaders } from "@/utils";
import { fetchDevelopers } from "@/utils/fetchDevelopers";

import { validateLanguage } from "@/utils/validators";
import { NextResponse } from "next/server";

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

  try {
    const developers = await fetchDevelopers(language, since, sponsorable);

    return NextResponse.json(developers, {
      headers: {
        ...getCacheHeaders(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      // TODO: Improve error message
      { error: "Looks like there was an error" },
      { status: 500 }
    );
  }
}
