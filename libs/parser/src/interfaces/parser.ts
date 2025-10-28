import type { ResumeData } from "@active-resume/schema";
import type { ZodDto } from "nestjs-zod/dto";
import type { Schema } from "zod/v3";

export type Parser<Data = unknown, T = ZodDto<Schema>, Result = ResumeData> = {
  schema?: Schema;

  readFile(file: File): Promise<Data>;

  validate(data: Data): T | Promise<T>;

  convert(data: T): Result | Promise<Result>;
};
