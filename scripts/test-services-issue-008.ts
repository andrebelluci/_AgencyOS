/**
 * ISSUE-008 — Smoke test via dev API route (services use server-only).
 *
 * Uso:
 *   1. npm run dev
 *   2. npm run db:test-services
 */
const BASE_URL = process.env.TEST_SERVICES_URL ?? "http://localhost:3000";

async function main() {
  console.log("Agency OS — services smoke test (ISSUE-008)\n");
  console.log(`GET ${BASE_URL}/api/dev/test-services\n`);

  const response = await fetch(`${BASE_URL}/api/dev/test-services`);

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

  console.log("\nServices layer OK (ISSUE-008).");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  console.error("Certifique-se de que o dev server está rodando (npm run dev).");
  process.exit(1);
});
