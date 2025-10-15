import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

const authProvidersSchema = z.array(z.enum(["email", "github", "google", "openid"]));

export class AuthProvidersDto extends createZodDto(authProvidersSchema) {}
