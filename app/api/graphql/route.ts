import { createSchema, createYoga } from "graphql-yoga";
import { fetchDevelopers } from "@/utils/fetchDevelopers";
import { SPOKEN_LANG } from "@/constants/filters";
import { fetchRepos } from "@/utils/fetchRepos";
import { useAPQ as createAutomaticPersistedQuery } from "@graphql-yoga/plugin-apq";
import { useResponseCache as createResponseCache } from "@graphql-yoga/plugin-response-cache";
import { CACHE_MAX_AGE } from "@/constants";
const fragment = `
`;

const enums = `
enum Since {
    DAILY
    WEEKLY
    MONTHLY
}

enum SpokenLanguage {
    ${SPOKEN_LANG.map(({ code }) => `${code.toUpperCase()}`).join("\n")}
}
`;

const types = `
type PopularRepository {
    description: String
    name: String
    url: String
}

type Developer {
    avatar: String
    name: String
    nickname: String
    url: String!
    popularRepository: PopularRepository
    canSponsor: Boolean
}

type Builder {
    avatar: String
    url: String
    username: String
}

type Repository {
    author: String
    avatar: String
    builtBy: [Builder]
    canSponsor: Boolean
    description: String
    forks: Int
    language: String
    languageColor: String
    name: String
    newStars: Int
    stars: Int
    url: String
}
`;

const queries = `
type Query {
    Developers(
        language: String
        since: Since = "DAILY"
        sponsorable: Boolean
    ): [Developer]

    Repositories(
        language: String
        spokenLanguage: SpokenLanguage = "EN"
        since: Since = "DAILY"
    ): [Repository]
}
`;

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      ${enums}
      ${types}
      ${fragment}
      ${queries}
    `,
    resolvers: {
      Since: {
        DAILY: "daily",
        WEEKLY: "weekly",
        MONTHLY: "monthly",
      },
      SpokenLanguage: SPOKEN_LANG.reduce(
        (acc, { code }) => ({ ...acc, [code.toUpperCase()]: code }),
        {}
      ),
      Query: {
        Developers: async (
          _,
          {
            since = "daily",
            language = "",
            sponsorable,
          }: {
            since: string;
            language: string;
            sponsorable?: boolean;
          }
        ) => await fetchDevelopers(language, since, sponsorable),
        Repositories: async (
          _,
          {
            language = "",
            since = "daily",
            spokenLanguage = "en",
          }: {
            language: string;
            since: string;
            spokenLanguage: string;
          }
        ) => await fetchRepos(language, since, spokenLanguage),
      },
    },
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },

  // Plugins
  plugins: [
    createResponseCache({
      session: () => null,
      ttl: CACHE_MAX_AGE,
      enabled: () => true,
    }),
    createAutomaticPersistedQuery(),
  ],
});

export { handleRequest as GET, handleRequest as POST };
