import "server-only";

import { getOpenAIClient } from "./client";

export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";

const EMBEDDING_BATCH_SIZE = 20;

export async function createQueryEmbedding(text: string): Promise<number[]> {
  const embeddings = await createDocumentEmbeddings([text]);
  const embedding = embeddings[0];

  if (!embedding || embedding.length === 0) {
    throw new Error("OpenAI returned an empty embedding.");
  }

  return embedding;
}

export async function createDocumentEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const inputs = texts.map((text) => text.trim()).filter(Boolean);

  if (inputs.length === 0) {
    return [];
  }

  const client = getOpenAIClient();
  const embeddings: number[][] = [];

  for (let index = 0; index < inputs.length; index += EMBEDDING_BATCH_SIZE) {
    const batch = inputs.slice(index, index + EMBEDDING_BATCH_SIZE);
    const response = await client.embeddings.create({
      model: DEFAULT_EMBEDDING_MODEL,
      input: batch,
    });

    const sorted = [...response.data].sort((a, b) => a.index - b.index);

    for (const item of sorted) {
      if (!item.embedding || item.embedding.length === 0) {
        throw new Error("OpenAI returned an empty embedding.");
      }
      embeddings.push(item.embedding);
    }
  }

  return embeddings;
}

export function formatVectorForPg(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
