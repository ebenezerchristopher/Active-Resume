import { z } from "zod/v3";

export const positionSchema = z.object({
  "Company Name": z.string(),
  Title: z.string(),
  Description: z.string().optional(),
  Location: z.string(),
  "Started On": z.string(),
  "Finished On": z.string().optional(),
});
