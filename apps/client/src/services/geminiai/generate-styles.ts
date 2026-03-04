import { DEFAULT_MODEL } from "@/client/constants/llm";
import { useGeminiAiStore } from "@/client/stores/geminiai";
import type { CustomTemplateOutput } from "@/artboard/schema/custom-template";

import { geminiai } from "./client";

const PROMPT = `You are an expert UI/UX designer and web developer specialized in creating layouts and styles for printable and digital resumes.

Your task is to generate both the custom layout structure and the CSS styles for a resume document based on the user's design instructions.

AVAILABLE DATA COMPONENTS (REACT COMPONENTS):
You must use these exact strings as the "type" field in your JSON node tree whenever you want to render the corresponding resume data section:
"Header", "Summary", "Profiles", "Experience", "Education", "Awards", "Certifications", "Skills", "Interests", "Publications", "Volunteer", "Languages", "Projects", "References", "Custom"

AVAILABLE SEMANTIC CLASSES:
resume-award, resume-award-awarder, resume-award-date, resume-award-main, resume-award-meta, resume-award-title, resume-certification, resume-certification-date, resume-certification-issuer, resume-certification-main, resume-certification-meta, resume-certification-name, resume-contact, resume-contact-icon, resume-contact-item, resume-contact-link, resume-contact-text, resume-custom, resume-custom-date, resume-custom-description, resume-custom-location, resume-custom-main, resume-custom-meta, resume-custom-name, resume-education, resume-education-area, resume-education-date, resume-education-institution, resume-education-main, resume-education-meta, resume-education-score, resume-education-study-type, resume-experience, resume-experience-company, resume-experience-date, resume-experience-location, resume-experience-main, resume-experience-meta, resume-experience-position, resume-header, resume-header-content, resume-headline, resume-interest, resume-interest-name, resume-item, resume-item-header, resume-item-keywords, resume-item-summary, resume-language, resume-language-description, resume-language-name, resume-layout, resume-link, resume-link-icon, resume-link-wrapper, resume-main, resume-main-content, resume-name, resume-picture, resume-profile, resume-profile-network, resume-profile-username, resume-project, resume-project-date, resume-project-description, resume-project-main, resume-project-meta, resume-project-name, resume-publication, resume-publication-date, resume-publication-main, resume-publication-meta, resume-publication-name, resume-publication-publisher, resume-rating, resume-rating-dot, resume-rating-dot-active, resume-reference, resume-reference-description, resume-reference-name, resume-section, resume-section-content, resume-section-title, resume-sidebar, resume-sidebar-content, resume-skill, resume-skill-description, resume-skill-name, resume-summary, resume-summary-content, resume-volunteer, resume-volunteer-date, resume-volunteer-location, resume-volunteer-main, resume-volunteer-meta, resume-volunteer-organization, resume-volunteer-position

LAYOUT STRUCTURE & ENFORCED JSON OUTPUT (JSON AST):
You must return a valid JSON object matching the provided schema exactly. It should contain two properties:
1. "html": A recursive JSON Abstract Syntax Tree (AST) representing the layout structure. 
Each node must be an object: { "type": "tagNameOrComponent", "props": { className?: "..." }, "children": [ ...an array of valid child nodes... ] }.
Use standard HTML tags (like "div", "section") OR the exact React Component strings listed above. The root node should act as the resume surface container.
2. "css": The CSS styling strictly targeting those classes.

CRITICAL CONSTRAINTS:
1. The contents must ALWAYS fill their respective containers completely.
2. The contents MUST NEVER overflow horizontally or vertically. Force text to wrap using properties like \`word-wrap: break-word\`, \`overflow-wrap: break-word\`, \`word-break: break-word\`, and \`max-width: 100%\`.
3. Ensure responsiveness and proportional structures.
4. When calling a React Component data section like { "type": "Experience" }, DO NOT include any inner children for that node. The React Component will automatically render its data internally.
`;

export const generateResumeLayout = async (): Promise<CustomTemplateOutput> => {
  /*const { model } = useGeminiAiStore.getState();

  const result = await geminiai().models.generateContent({
    model: model ?? DEFAULT_MODEL,
    contents: PROMPT,
    config: {
      responseMimeType: "application/json",
      // Since GoogleGenAI requires OpenAPI schema shape, we enforce a strict JSON structure via prompt & mime type
    },
  });

  if (result.candidates?.length === 0) {
    throw new Error(`The AI did not return any styles for your prompt.`);
  }

  const generatedText = result.text ?? ""; */

  const generatedText = {
    html: {
      type: "div",
      props: {
        className: "resume-layout",
      },
      children: [
        {
          type: "div",
          props: {
            className: "resume-container",
          },
          children: [
            {
              type: "Header",
              props: {},
              children: [],
            },
            {
              type: "div",
              props: {
                className: "resume-separator",
              },
              children: [],
            },
            {
              type: "Summary",
              props: {},
              children: [],
            },
            {
              type: "div",
              props: {
                className: "resume-core-content",
              },
              children: [
                {
                  type: "Experience",
                  props: {},
                  children: [],
                },
                {
                  type: "Education",
                  props: {},
                  children: [],
                },
                {
                  type: "Projects",
                  props: {},
                  children: [],
                },
              ],
            },
            {
              type: "div",
              props: {
                className: "resume-secondary-grid",
              },
              children: [
                {
                  type: "Skills",
                  props: {},
                  children: [],
                },
                {
                  type: "Certifications",
                  props: {},
                  children: [],
                },
                {
                  type: "Awards",
                  props: {},
                  children: [],
                },
                {
                  type: "Languages",
                  props: {},
                  children: [],
                },
                {
                  type: "Volunteer",
                  props: {},
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    css: "/* \n  THEME: Classic Academic / Executive (Single Column) \n  Distinctive Features: Serif typography, Centered Header, Grid for Metadata\n*/\n\n.resume-layout {\n  width: 100%;\n  background-color: #ffffff;\n  color: #111111;\n  font-family: 'Georgia', 'Times New Roman', serif;\n  line-height: 1.6;\n  overflow: hidden;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n}\n\n.resume-container {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 50px 60px;\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: border-box;\n}\n\n/* --- HEADER (Centered, Elegant) --- */\n.resume-header {\n  text-align: center;\n  margin-bottom: 20px;\n}\n\n.resume-header-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.resume-name {\n  font-size: 36px;\n  font-weight: 400;\n  text-transform: uppercase;\n  letter-spacing: 3px;\n  border-bottom: 1px solid #111;\n  padding-bottom: 10px;\n  margin-bottom: 15px;\n  color: #000;\n}\n\n.resume-headline {\n  font-family: 'Arial', sans-serif;\n  font-size: 14px;\n  text-transform: uppercase;\n  letter-spacing: 1.5px;\n  color: #555;\n  margin-bottom: 15px;\n}\n\n.resume-picture {\n  display: none;\n  /* Hiding picture for a purely classic text-based look, or remove this line to show it rounded centered */\n}\n\n.resume-contact {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 20px;\n  font-family: 'Arial', sans-serif;\n  font-size: 12px;\n  color: #444;\n}\n\n.resume-contact-link {\n  color: #444;\n  text-decoration: none;\n  border-bottom: 1px dotted #999;\n}\n\n/* --- SECTIONS GENERAL --- */\n.resume-section {\n  margin-bottom: 35px;\n}\n\n.resume-section-title {\n  font-family: 'Arial', sans-serif;\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 1.5px;\n  color: #333;\n  border-bottom: 2px solid #333;\n  padding-bottom: 5px;\n  margin-bottom: 20px;\n  text-align: left;\n}\n\n/* --- SUMMARY --- */\n.resume-summary-content {\n  text-align: justify;\n  font-size: 15px;\n  color: #333;\n}\n\n/* --- EXPERIENCE & PROJECTS (List View) --- */\n.resume-experience-item, \n.resume-project-item {\n  margin-bottom: 25px;\n}\n\n.resume-experience-header, \n.resume-project-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  border-bottom: 1px solid #eee;\n  padding-bottom: 3px;\n  margin-bottom: 8px;\n}\n\n.resume-experience-position,\n.resume-project-name {\n  font-size: 18px;\n  font-weight: 700;\n  color: #000;\n}\n\n.resume-experience-company {\n  font-size: 16px;\n  font-style: italic;\n  color: #444;\n  margin-right: auto;\n  padding-left: 10px;\n}\n\n.resume-experience-date, \n.resume-project-date {\n  font-family: 'Arial', sans-serif;\n  font-size: 12px;\n  color: #666;\n  white-space: nowrap;\n}\n\n.resume-experience-location {\n  font-family: 'Arial', sans-serif;\n  font-size: 11px;\n  color: #888;\n}\n\n.resume-experience-description, \n.resume-project-description {\n  font-family: 'Arial', sans-serif;\n  font-size: 13px;\n  color: #444;\n  line-height: 1.5;\n  margin-top: 10px;\n}\n\n/* --- EDUCATION --- */\n.resume-education-item {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 15px;\n}\n\n.resume-education-institution {\n  font-weight: 700;\n  font-size: 16px;\n}\n\n.resume-education-area {\n  font-style: italic;\n}\n\n.resume-education-date {\n  font-family: 'Arial', sans-serif;\n  font-size: 12px;\n  color: #666;\n}\n\n/* --- SECONDARY GRID (Skills, Awards, etc.) --- */\n/* Creating a masonry-like grid for the bottom sections */\n.resume-secondary-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 40px;\n  border-top: 4px double #eee;\n  padding-top: 30px;\n}\n\n@media (max-width: 768px) {\n  .resume-secondary-grid {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .resume-container {\n    padding: 20px;\n  }\n}\n\n/* Skills Styling in Grid */\n.resume-skill-item {\n  margin-bottom: 10px;\n}\n\n.resume-skill-name {\n  font-weight: 700;\n  font-size: 14px;\n  font-family: 'Arial', sans-serif;\n  display: inline-block;\n  min-width: 120px;\n}\n\n.resume-skill-description {\n  display: inline;\n  font-size: 13px;\n  color: #555;\n  font-family: 'Arial', sans-serif;\n}\n\n/* Awards & Certs */\n.resume-award-item, \n.resume-certification-item,\n.resume-volunteer-item {\n  margin-bottom: 10px;\n}\n\n.resume-award-title, \n.resume-certification-name,\n.resume-volunteer-organization {\n  font-weight: 700;\n  font-size: 14px;\n  display: block;\n}\n\n.resume-award-date, \n.resume-certification-date,\n.resume-volunteer-date {\n  font-family: 'Arial', sans-serif;\n  font-size: 11px;\n  color: #777;\n}\n\n/* Languages */\n.resume-language-item {\n  display: flex;\n  justify-content: space-between;\n  border-bottom: 1px dotted #ccc;\n  padding-bottom: 2px;\n  margin-bottom: 5px;\n}\n\n.resume-language-name {\n  font-weight: 700;\n  font-size: 14px;\n}\n",
  };
  /*
  const cleanedText = generatedText
    .replace(/^```(json)?\n?/gm, "")
    .replace(/```$/gm, "")
    .trim(); 
  */

  try {
    return JSON.parse(JSON.stringify(generatedText)) as CustomTemplateOutput;
  } catch {
    throw new Error("The AI failed to return a valid JSON structure for the template.");
  }
};
