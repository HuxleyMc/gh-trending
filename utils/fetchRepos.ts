import { parseNumber, validateHexColor } from "@/utils/validators";
import * as cheerio from "cheerio";
import { CACHE_MAX_AGE, GITHUB_URL } from "@/constants";
import { getCachedItem, setCachedItem } from "@/utils/cache";
import { Repositories, repositoriesSchema } from "@/schemas/repository";

const cacheKeyBuilder = (
  language: string,
  since: string,
  spokenLanguage: string
) =>
  `repos_${language.length >= 1 ? language : "all"}_${since}_${spokenLanguage}`;

export const fetchRepos = async (
  language: string,
  since: string = "daily",
  spokenLanguage: string
) => {
  const cacheKey = cacheKeyBuilder(
    language.length > 1 ? language : "all",
    since,
    spokenLanguage
  );

  const cachedItem = await getCachedItem(cacheKey);
  if (cachedItem) {
    return cachedItem;
  }

  const queryUrl = new URL(`${GITHUB_URL}/trending/${language}`);
  queryUrl.searchParams.set("since", since);
  queryUrl.searchParams.set("spoken_language_code", spokenLanguage);

  console.log("Query URL: ", queryUrl.toString());

  console.time("Request");
  const response = await fetch(queryUrl.toString(), {
    next: {
      revalidate: CACHE_MAX_AGE,
      tags: ["trending", "language", language, since],
    },
  });
  const responseData = await response.text();
  console.timeEnd("Request");

  console.time("Parsing");

  const $ = cheerio.load(responseData);

  const repos = $(".Box article.Box-row");

  const formattedRepos: Repositories = repos.get().map((repo) => {
    const $repo = $(repo);

    const href = $repo.find("h2 > a")?.prop("href")?.trim();

    const name = href?.split("/").pop() ?? "";

    const author = href?.split("/")[1] ?? "";

    const avatar = `${GITHUB_URL}/${author}.png`;

    const descriptionElement = $repo.find("p");
    const hasDescription = descriptionElement.length > 0;

    const description = hasDescription ? descriptionElement.text().trim() : "";

    const language =
      $repo
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > span:nth-child(1)`)
        .text()
        .trim() ?? "";

    const stars = parseNumber(
      $repo
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > a:nth-child(2)`)
        .first()
        .text()
        .trim()
    );

    const forks = parseNumber(
      $repo
        .find(`div:nth-child(${hasDescription ? 4 : 3}) > a:nth-child(3)`)
        .last()
        .text()
        .trim()
    );

    const newStars = parseNumber(
      $repo.find("span.float-sm-right").text().trim().split(" ")[0]
    );

    const url = `${GITHUB_URL}${href}`;

    const languageColor = validateHexColor(
      $repo
        .find("div:nth-child(4) > span:nth-child(1) > span:nth-child(1)")
        .css("background-color") ?? ""
    );

    const canSponsor =
      $repo.find("div:nth-child(1) > a:nth-child(1)").text().trim() ===
      "Sponsor";

    const builtBy = $repo
      .find(`div:nth-child(${hasDescription ? 4 : 3}) > span:nth-child(4) > a`)
      .get()
      .map((el) => {
        const url = $(el).attr("href");
        return {
          avatar: $(el).find("img").attr("src") ?? "",
          url: `${GITHUB_URL}${url}`,
          username: url?.split("/")?.pop() ?? "",
        };
      })
      .filter(
        ({ username, avatar, url }) =>
          username && avatar && url && !url.includes("github.comundefined")
      );

    return {
      author,
      avatar,
      builtBy,
      canSponsor,
      description,
      forks,
      language,
      languageColor,
      name,
      newStars,
      stars,
      url,
    };
  });

  const filteredRepos = formattedRepos.filter(
    ({ name, avatar, author, url, language, languageColor }) =>
      author &&
      url &&
      name &&
      language &&
      languageColor &&
      avatar &&
      !url.includes("github.comundefined")
  );

  const data = repositoriesSchema.safeParse(filteredRepos);

  if (!data.success) {
    throw new Error("Failed to parse repositories");
  }

  console.timeEnd("Parsing");

  await setCachedItem(cacheKey, {
    data: data.data,
    timestamp: Date.now(),
  });

  return filteredRepos;
};
