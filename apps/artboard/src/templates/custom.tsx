import type { ASTNode } from "../schema/custom-template";
import type { TemplateProps } from "../types/template";
import React from "react";
import {
  Header,
  Summary,
  Profiles,
  ExperienceComponent,
  EducationComponent,
  Awards,
  Certifications,
  Skills,
  Interests,
  Publications,
  VolunteerComponent,
  Languages,
  Projects,
  References,
  Custom,
} from "./components";

const componentMap: Record<string, React.FC<any>> = {
  Header,
  Summary,
  Profiles,
  Experience: ExperienceComponent,
  Education: EducationComponent,
  Awards,
  Certifications,
  Skills,
  Interests,
  Publications,
  Volunteer: VolunteerComponent,
  Languages,
  Projects,
  References,
  Custom,
};

const ASTNodeRenderer = ({ node }: { node: ASTNode | string }): React.ReactNode => {
  if (typeof node === "string") return node;

  const { type, props, children } = node;

  // Render mapped React component if "type" exists in our component tree
  const Component = componentMap[type];
  if (Component) {
    return <Component {...(props || {})} />;
  }

  // Otherwise, it's a standard HTML tag
  const mappedChildren = Array.isArray(children)
    ? children.map((child, idx) => <ASTNodeRenderer key={idx} node={child} />)
    : children;

  return React.createElement(type, props, mappedChildren);
};

export const CustomTemplate = ({ customLayout }: TemplateProps) => {
  if (!customLayout) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center text-primary/50">
        Generating your custom layout structure...
      </div>
    );
  }

  return (
    <div className="resume-layout">
      <ASTNodeRenderer node={customLayout} />
    </div>
  );
};
