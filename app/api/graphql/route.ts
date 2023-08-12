import { createSchema, createYoga } from "graphql-yoga";
import { fetchDevelopers } from "@/utils/fetchDevelopers";
import { SPOKEN_LANG } from "@/constants/filters";
import { fetchRepos } from "@/utils/fetchRepos";
import { useAPQ as createAutomaticPersistedQuery } from "@graphql-yoga/plugin-apq";
import { useResponseCache as createResponseCache } from "@graphql-yoga/plugin-response-cache";
import { CACHE_MAX_AGE } from "@/constants";
import { typeDefs } from "@/schemas/graphql";

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
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
    }),
    createAutomaticPersistedQuery(),
  ],
});

export { handleRequest as GET, handleRequest as POST };
