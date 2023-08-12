import { SPOKEN_LANG } from "@/constants/filters";

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
    name: String!
    url: String!
}

type Developer {
    avatar: String!
    name: String!
    nickname: String!
    url: String!
    popularRepository: PopularRepository
    canSponsor: Boolean!
}

type Builder {
    avatar: String!
    url: String!
    username: String!
}

type Repository {
    author: String!
    avatar: String!
    builtBy: [Builder]
    canSponsor: Boolean!
    description: String
    forks: Int!
    language: String
    languageColor: String
    name: String!
    newStars: Int!
    stars: Int!
    url: String!
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
/**
 * GraphQL schema
 */
export const typeDefs = `
  ${fragment}
  ${enums}
  ${types}
  ${queries}
`;
