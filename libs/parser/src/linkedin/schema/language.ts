import { z } from "zod/v3";

export const languageSchema = z.object({
  Name: z.string(),
  Proficiency: z.string().optional(),
});
