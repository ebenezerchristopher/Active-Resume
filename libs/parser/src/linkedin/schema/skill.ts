import { z } from "zod/v3";

export const skillSchema = z.object({
  Name: z.string(),
});
