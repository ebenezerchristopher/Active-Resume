import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

import { userSchema } from "../user";

export const authResponseSchema = z.object({
  status: z.enum(["authenticated", "2fa_required"]),
  user: userSchema,
});

export class AuthResponseDto extends createZodDto(authResponseSchema) {}
