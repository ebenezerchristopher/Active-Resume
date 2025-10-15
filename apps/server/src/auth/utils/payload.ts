import { idSchema } from "@active-resume/schema";
import { z } from "zod/v3";

export const payloadSchema = z.object({
  id: idSchema,
  isTwoFactorAuth: z.boolean().optional(),
});

export type Payload = z.infer<typeof payloadSchema>;
