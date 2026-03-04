import { z } from "zod";

// Recursive AST Node schema
export const astNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z
      .string()
      .describe(
        "The HTML tag (e.g., 'div', 'h1') or the React Component name (e.g., 'Experience', 'Header', 'Summary')",
      ),
    props: z
      .record(z.string(), z.any())
      .optional()
      .describe("HTML attributes like className or style"),
    children: z.union([z.string(), z.array(astNodeSchema)]).optional(),
  }),
);

export const customTemplateSchema = z.object({
  html: astNodeSchema.describe(
    "The recursive JSON Abstract Syntax Tree representing the document layout.",
  ),
  css: z.string().describe("The CSS styles for the resume document."),
});

export type ASTNode = z.infer<typeof astNodeSchema>;
export type CustomTemplateOutput = z.infer<typeof customTemplateSchema>;
