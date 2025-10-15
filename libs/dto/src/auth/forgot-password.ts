import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

export const forgotPasswordSchema = z.object({ email: z.string().email() });

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
