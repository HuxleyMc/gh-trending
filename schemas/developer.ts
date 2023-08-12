import { z } from "zod";

export const developerSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  nickname: z.string(),
  url: z.string(),
  popularRepository: z.object({
    description: z.string(),
    name: z.string(),
    url: z.string(),
  }),
  canSponsor: z.boolean(),
});

export type Developer = z.infer<typeof developerSchema>;

export const developersSchema = z.array(developerSchema);

export type Developers = z.infer<typeof developersSchema>;
