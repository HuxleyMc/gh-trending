import * as cheerio from "cheerio";
import { GITHUB_URL } from "@/constants";
import { getCachedItem, setCachedItem } from "@/utils/cache";
import { Developers, developersSchema } from "@/schemas/developer";

const cacheKeyBuilder = (
  language: string,
  since: string,
  sponsorable: boolean
) =>
  `developers-${language.length > 1 ? language : "all"}-${since}-${
    sponsorable ? "sponsorable" : "not-sponsorable"
  }`;

export const fetchDevelopers = async (
  language: string,
  since: string = "daily",
  sponsorable: boolean = false
): Promise<Developers | null> => {
  const cacheKey = cacheKeyBuilder(language, since, sponsorable);

  const cachedItem = await getCachedItem(cacheKey);

  if (cachedItem) {
    return cachedItem as Developers;
  }

  const queryUrl = new URL(`${GITHUB_URL}/trending/developers/${language}`);
  queryUrl.searchParams.set("since", since);
  if (sponsorable) queryUrl.searchParams.set("sponsorable", "1");

  console.log("Query URL: ", queryUrl.toString());

  console.time("Request");
  const response = await fetch(queryUrl.toString(), {
    next: {
      tags: ["trending", "developer", language, since],
    },
  });
  const responseData = await response.text();
  console.timeEnd("Request");

  console.time("Parsing");

  const $ = cheerio.load(responseData);

  const develoeprs = $(".Box article.Box-row");

  const parsedDevelopers: Developers = develoeprs.get().map((developer) => {
    const $developer = $(developer);
    const userElement = $developer.find("h1.h3 a");
    const name = userElement.text().trim();
    const url = `${GITHUB_URL}${userElement.attr("href")}`;
    const nickname = $developer
      .find(
        "div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > a:nth-child(1)"
      )
      .text()
      .trim();
    const avatar =
      $developer
        .find("div:nth-child(2) > a:nth-child(1) > img:nth-child(1)")
        .attr("src") ?? `${GITHUB_URL}${userElement.attr("href")}.png`;
    const popularRepository = {
      name: $developer.find("h1.h4 a").text().trim(),
      description: $developer
        .find(
          "div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > article:nth-child(1) > div:nth-child(3)"
        )
        .text()
        .trim(),
      url: `${GITHUB_URL}${$developer.find("h1.h4 a").attr("href")}`,
    };
    const canSponsor =
      $developer.find("div:nth-child(1) > a:nth-child(1)").text().trim() ===
      "Sponsor";

    return {
      name,
      nickname,
      avatar,
      url,
      popularRepository,
      canSponsor,
    };
  });

  console.timeEnd("Parsing");

  const data = developersSchema.safeParse(parsedDevelopers);

  if (!data.success) {
    throw new Error("Failed to parse developers");
  }

  setCachedItem(cacheKey, {
    data: data.data,
    timestamp: Date.now(),
  });

  return parsedDevelopers;
};
