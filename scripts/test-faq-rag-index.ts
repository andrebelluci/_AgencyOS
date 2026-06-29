/**
 * Smoke tests for FAQ RAG indexing (format + optional live search).
 *
 *   npx tsx scripts/test-faq-rag-index.ts
 *   TEST_FAQ_RAG_URL=http://localhost:3000 npx tsx --env-file=.env.local scripts/test-faq-rag-index.ts
 */
import {
  formatFaqChunkContent,
  parseFaqAnswerFromChunk,
} from "../src/modules/knowledge/faq-format";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function testFormatRoundTrip(): void {
  const formatted = formatFaqChunkContent(
    "Qual roupa devo usar?",
    "Padrinhos com terno preto.\nMadrinhas com as cores da paleta.",
  );

  assert(formatted.includes("Pergunta:\nQual roupa devo usar?"), "question in chunk");
  assert(
    formatted.includes("Resposta:\nPadrinhos com terno preto."),
    "answer in chunk",
  );

  const parsed = parseFaqAnswerFromChunk(formatted);
  assert(parsed.startsWith("Padrinhos com terno preto."), "parse answer");
  console.log("PASS — faq:format-roundtrip");
}

async function testLiveParaphraseSearch(): Promise<void> {
  const baseUrl = process.env.TEST_FAQ_RAG_URL?.trim();
  if (!baseUrl) {
    console.log("SKIP — live paraphrase (set TEST_FAQ_RAG_URL for integration)");
    return;
  }

  const response = await fetch(`${baseUrl}/api/dev/test-search-knowledge`);
  const body = (await response.json()) as {
    ok?: boolean;
    checks?: string[];
    error?: string;
  };

  if (!response.ok || !body.ok) {
    throw new Error(body.error ?? `HTTP ${response.status}`);
  }

  assert(
    body.checks?.includes("search:faq-paraphrase") ?? false,
    "expected search:faq-paraphrase check",
  );

  console.log("PASS — faq:live-paraphrase-search");
}

async function main(): Promise<void> {
  console.log("Agency OS — FAQ RAG index tests\n");
  testFormatRoundTrip();
  await testLiveParaphraseSearch();
  console.log("\nFAQ RAG index tests OK.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  process.exit(1);
});
