import { z } from "zod/v3";

export const educationSchema = z.object({
  "School Name": z.string(),
  "Start Date": z.string(),
  "End Date": z.string().optional(),
  Notes: z.string().optional(),
  "Degree Name": z.string(),
  Activities: z.string(),
});
