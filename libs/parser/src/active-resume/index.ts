import type { ResumeData } from "@active-resume/schema";
import { resumeDataSchema } from "@active-resume/schema";
import type { Json } from "@active-resume/utils";
import type { Schema } from "zod/v3";

import type { Parser } from "../interfaces/parser";

export class ActiveResumeParser implements Parser<Json, ResumeData> {
  schema: Schema;

  constructor() {
    this.schema = resumeDataSchema;
  }

  readFile(file: File): Promise<Json> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result as string) as Json;
          resolve(result);
        } catch {
          reject(new Error("Failed to parse JSON"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsText(file);
    });
  }

  validate(data: Json) {
    return this.schema.parse(data) as ResumeData;
  }

  convert(data: ResumeData) {
    return data;
  }
}
