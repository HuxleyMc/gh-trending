import { fetchDevelopers } from "@/utils/fetchDevelopers";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sponsorable = searchParams.get("sponsorable") === "1" ?? false;
  const since = searchParams.get("since") ?? "daily";

  if (!["daily", "weekly", "monthly"].includes(since)) {
    return NextResponse.json({ error: "Invalid since" }, { status: 400 });
  }

  const developers = await fetchDevelopers("", since, sponsorable);

  return NextResponse.json(developers, {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  });
}
