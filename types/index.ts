export type Repo = {
  author: string;
  avatar: string;
  builtBy: Array<RepoBuilder>;
  canSponsor: boolean;
  description?: string;
  forks: number;
  language: string;
  languageColor?: string;
  name: string;
  newStars: number;
  stars: number;
  url: string;
};

export type RepoBuilder = {
  avatar: string;
  url: string;
  username: string;
};
