import { z } from "zod/v3";

export const emailSchema = z.object({
  "Email Address": z.string().email(),
  Confirmed: z.enum(["Yes", "No"]),
  Primary: z.enum(["Yes", "No"]),
  "Updated On": z.string(),
});
