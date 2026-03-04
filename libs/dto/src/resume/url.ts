import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

export const urlSchema = z.object({ url: z.string().url() });

export class UrlDto extends createZodDto(urlSchema) {}
