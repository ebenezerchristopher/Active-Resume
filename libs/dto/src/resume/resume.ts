import { defaultResumeData, idSchema, resumeDataSchema } from "@active-resume/schema";
import { dateSchema } from "@active-resume/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod/v3";

import { userSchema } from "../user";

export const resumeSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  data: resumeDataSchema.default(defaultResumeData),
  visibility: z.enum(["private", "public"]).default("private"),
  locked: z.boolean().default(false),
  userId: idSchema,
  user: userSchema.optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export class ResumeDto extends createZodDto(resumeSchema) {}
