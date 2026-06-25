/**
 * ISSUE-024 — Smoke test for PDF upload pipeline.
 *
 * Uso:
 *   1. npm run dev
 *   2. npm run test:pdf-pipeline
 */
const PDF_PIPELINE_TEST_URL =
  process.env.TEST_PDF_PIPELINE_URL ?? "http://localhost:3000";

void (async () => {
  console.log("Agency OS — PDF pipeline smoke test (ISSUE-024)\n");
  console.log(`GET ${PDF_PIPELINE_TEST_URL}/api/dev/test-pdf-pipeline\n`);

  const response = await fetch(
    `${PDF_PIPELINE_TEST_URL}/api/dev/test-pdf-pipeline`,
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

  console.log("\nPDF pipeline OK (ISSUE-024).");
})().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  console.error("Certifique-se de que o dev server está rodando (npm run dev).");
  process.exit(1);
});
