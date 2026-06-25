/**
 * ISSUE-022 — Smoke test for searchKnowledge tool.
 *
 * Uso:
 *   1. npm run dev
 *   2. npm run test:search-knowledge
 */
const SEARCH_KNOWLEDGE_TEST_URL =
  process.env.TEST_SEARCH_KNOWLEDGE_URL ?? "http://localhost:3000";

void (async () => {
  console.log("Agency OS — searchKnowledge smoke test (ISSUE-022)\n");
  console.log(`GET ${SEARCH_KNOWLEDGE_TEST_URL}/api/dev/test-search-knowledge\n`);

  const response = await fetch(
    `${SEARCH_KNOWLEDGE_TEST_URL}/api/dev/test-search-knowledge`,
  );

  const body = (await response.json()) as {
    ok?: boolean;
    checks?: string[];
    error?: string;
  };

  if (!response.ok || !body.ok) {
    throw new Error(body.error ?? `HTTP ${response.status}`);
  }

  for (const check of body.checks ?? []) {
    console.log(`PASS — ${check}`);
  }

  console.log("\nsearchKnowledge tool OK (ISSUE-022).");
})().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  console.error("Certifique-se de que o dev server está rodando (npm run dev).");
  process.exit(1);
});
