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

export type Developer = {
  avatar: string;
  name: string;
  nickname: string;
  url: string;
  popularRepository: {
    description: string;
    name: string;
    url: string;
  };
  canSponsor: boolean;
};
