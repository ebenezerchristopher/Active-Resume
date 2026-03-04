import type { SectionKey } from "@active-resume/schema";
import type { ASTNode } from "../schema/custom-template";

export type TemplateProps = {
  columns: SectionKey[][];
  isFirstPage?: boolean;
  customLayout?: ASTNode;
};
