import { z } from "zod";

export const builderSchema = z.object({
  avatar: z.string(),
  url: z.string(),
  username: z.string(),
});

export type Builder = z.infer<typeof builderSchema>;

export const repositorySchema = z.object({
  author: z.string(),
  avatar: z.string(),
  builtBy: z.array(builderSchema),
  canSponsor: z.boolean(),
  description: z.string().optional(),
  forks: z.number(),
  language: z.string(),
  languageColor: z.string().optional(),
  name: z.string(),
  newStars: z.number(),
  stars: z.number(),
  url: z.string(),
});

export type Repository = z.infer<typeof repositorySchema>;

export const repositoriesSchema = z.array(repositorySchema);

export type Repositories = z.infer<typeof repositoriesSchema>;
