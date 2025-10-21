import { idSchema } from "@active-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

export const deleteResumeSchema = z.object({
  id: idSchema,
});

export class DeleteResumeDto extends createZodDto(deleteResumeSchema) {}
