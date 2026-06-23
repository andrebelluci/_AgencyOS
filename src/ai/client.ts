import OpenAI from "openai";

import { getServerEnv } from "@/env";

export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (client) {
    return client;
  }

  const env = getServerEnv();

  if (!env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required. Set it in .env.local — see .env.example.",
    );
  }

  client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return client;
}
