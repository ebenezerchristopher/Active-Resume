import { GoogleGenAI } from "@google/genai";

import { useGeminiAiStore } from "@/client/stores/geminiai";

export const geminiai = () => {
  const { apiKey } = useGeminiAiStore.getState();

  if (!apiKey) {
    throw new Error(
      `Your OpenAI API Key has not been set yet. Please go to your account settings to enable OpenAI Integration.`,
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
};
