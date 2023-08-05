import * as cheerio from "cheerio";
import { Developer } from "@/types";
import { CACHE_MAX_AGE, GITHUB_URL } from "@/constants";
import { cacheInstance } from "./cache";

export const fetchDevelopers = async (
  language: string,
  since: string = "daily",
  sponsorable: boolean = false
) => {
  const queryUrl = new URL(`${GITHUB_URL}/trending/developers/${language}`);
  queryUrl.searchParams.set("since", since);
  if (sponsorable) queryUrl.searchParams.set("sponsorable", "1");

  console.log("Query URL: ", queryUrl.toString());

  console.time("Request");
  const response = await fetch(queryUrl.toString(), {
    next: {
      revalidate: CACHE_MAX_AGE,
      tags: ["trending", "developer", language, since],
    },
  });
  const data = await response.text();
  console.timeEnd("Request");

  const getDevelopers = async () => {
    console.time("Parsing");

    const $ = cheerio.load(data);

    const develoeprs = $(".Box article.Box-row");

    const parsedDevelopers: Array<Developer> = develoeprs
      .get()
      .map((developer) => {
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
    return parsedDevelopers;
  };

  const results = await cacheInstance.handle(
    queryUrl.toString(),
    getDevelopers
  );

  return results;
};
