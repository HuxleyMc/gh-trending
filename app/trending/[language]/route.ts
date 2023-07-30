import { validateLanguage } from "@/utils/validators";
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const parseNumber = (str = "") => {
  const number = Number.parseInt(str.replaceAll(",", "").trim());
  return isNaN(number) ? 0 : number;
};

type Repo = {
  name: string;
  author: string;
  avatar: string;
  description: string;
  stars: number;
  forks: number;
  newStars: number;
  url: string;
  language: string;
  languageColor?: string;
  canSponsor: boolean;
  builtBy: Array<Builder>;
};

type Builder = {
  username: string;
  url: string;
  avatar: string;
};

export async function GET(
  request: Request,
  { params }: { params: { language: string } }
) {
  const startTime = performance.now();
  const { searchParams } = new URL(request.url);

  const spokenLanguage = searchParams.get("spoken_language_code") ?? "en";
  const since = searchParams.get("since") ?? "daily";

  const language = validateLanguage(params.language ?? "");

  if (!language) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const queryUrl = new URL(`https://github.com/trending/${language}`);
  queryUrl.searchParams.set("since", since);
  queryUrl.searchParams.set("spoken_language_code", spokenLanguage);

  console.log("Query URL: ", queryUrl.toString());

  const response = await axios.get(queryUrl.toString(), {
    headers: {
      // cache for 1 hour
      "Cache-Control": "public, max-age=3600",
    },
  });

  const $ = cheerio.load(response.data);

  const repos = $(".Box article.Box-row");

  const formattedRepos: Array<Repo> = repos.get().map((repo) => {
    const href = $(repo).find("h2 > a")?.prop("href")?.trim();

    const name = href?.split("/").pop() ?? "";

    const author = href?.split("/")[1] ?? "";

    const avatar = `https://github.com/${author}.png`;

    const hasDescription = $(repo).find("p").length > 0;

    const description = $(repo).find("p").text().trim() ?? "";

    const language =
      $(repo)
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > span:nth-child(1)`)
        .text()
        .trim() ?? "";

    const stars = parseNumber(
      $(repo)
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > a:nth-child(2)`)
        .first()
        .text()
        .trim()
    );

    const forks = parseNumber(
      $(repo)
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > a:nth-child(3)`)
        .last()
        .text()
        .trim()
    );

    const newStars = parseNumber(
      $(repo).find("span.float-sm-right").text().trim().split(" ")[0]
    );

    const url = `https://github.com${href}`;

    const languageColor = $(repo)
      .find("div:nth-child(4) > span:nth-child(1) > span:nth-child(1)")
      .css("background-color");

    const canSponsor =
      $(repo).find("div:nth-child(1) > a:nth-child(1)").text().trim() ===
      "Sponsor";

    const builtBy = $(repo)
      .find(`div:nth-child(${hasDescription ? 4 : 3}) > span:nth-child(4) > a`)
      .get()
      .map((el) => {
        const url = $(el).attr("href");
        return {
          username: url?.split("/")?.pop() ?? "",
          url: `https://github.com${url}`,
          avatar: $(el).find("img").attr("src") ?? "",
        };
      });

    return {
      name,
      avatar,
      author,
      description,
      stars,
      forks,
      newStars,
      url,
      language,
      languageColor,
      canSponsor,
      builtBy,
    };
  });

  console.log("Time taken: ", performance.now() - startTime + "ms");
  return NextResponse.json(formattedRepos);
}
