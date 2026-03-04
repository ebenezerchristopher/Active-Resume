import { t } from "@lingui/core/macro";

import { DEFAULT_MODEL } from "@/client/constants/llm";
import { useGeminiAiStore } from "@/client/stores/geminiai";

import { geminiai } from "./client";

const PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved. It should not begin with a newline. It should not have any prefix or suffix text.
Just fix the spelling and grammar of the following paragraph, do not change the meaning and returns in the language of the text:

Text: """{input}"""

Revised Text: """`;

export const fixGrammar = async (text: string) => {
  const prompt = PROMPT.replace("{input}", text);

  const { model } = useGeminiAiStore.getState();

  const result = await geminiai().models.generateContent({
    model: model ?? DEFAULT_MODEL,
    contents: prompt,
  });

  if (result.candidates?.length === 0) {
    throw new Error(t`OpenAI did not return any choices for your text.`);
  }

  return result.text ?? text;
};
