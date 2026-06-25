import "server-only";

import { getOpenAIClient } from "./client";

export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";

export async function createQueryEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: DEFAULT_EMBEDDING_MODEL,
    input: text.trim(),
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding || embedding.length === 0) {
    throw new Error("OpenAI returned an empty embedding.");
  }

  return embedding;
}

export function formatVectorForPg(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
