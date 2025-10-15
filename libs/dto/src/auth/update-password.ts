import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export class UpdatePasswordDto extends createZodDto(updatePasswordSchema) {}
