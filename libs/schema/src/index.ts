import { basicsSchema, defaultBasics } from "./basics";
import { sectionsSchema, defaultSections } from "./sections";
import { metadataSchema, defaultMetadata } from "./metadata";
import { z } from "zod/v3";

// Schema
export const resumeDataSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  metadata: metadataSchema,
});

// Type
export type ResumeData = z.infer<typeof resumeDataSchema>;

// Defaults
export const defaultResumeData: ResumeData = {
  basics: defaultBasics,
  sections: defaultSections,
  metadata: defaultMetadata,
};

export * from "./basics";
export * from "./metadata";
export * from "./shared";
export * from "./sections";
export * from "./sample";
