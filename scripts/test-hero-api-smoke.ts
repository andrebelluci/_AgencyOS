/**
 * QA smoke for hero API (ISSUE-036).
 * Usage: tsx --env-file=.env.local scripts/test-hero-api-smoke.ts
 */
const BASE = process.env.HERO_TEST_BASE_URL?.trim() || "http://localhost:3000";
const PUBLIC_KEY = process.env.E2E_PUBLIC_KEY?.trim() || "pk_dev_local";

async function postHero(body: Record<string, string | undefined>) {
  const response = await fetch(`${BASE}/api/chat/hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON (${response.status}): ${text}`);
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${JSON.stringify(payload)}`,
    );
  }

  return payload as {
    conversationId: string;
    step: { field: string } | null;
    done: boolean;
    whatsappUrl: string | null;
    messages: Array<{ role: string; content: string }>;
  };
}

async function main() {
  const start = await postHero({
    public_key: PUBLIC_KEY,
    action: "start",
    visitor_id: `qa-hero-${Date.now()}`,
  });

  if (!start.conversationId) {
    throw new Error("start: missing conversationId");
  }

  if (!start.step || start.step.field !== "service") {
    throw new Error(`start: expected service step, got ${start.step?.field}`);
  }

  const answers = [
    { value: "Acabamento", field: "city" },
    { value: "Campinas", field: "deadline" },
    { value: "30_dias", field: "name" },
    { value: "Maria QA", field: "phone" },
    { value: "19999998888", field: null },
  ];

  let conversationId = start.conversationId;
  let last = start;

  for (const answer of answers) {
    last = await postHero({
      public_key: PUBLIC_KEY,
      action: "answer",
      conversation_id: conversationId,
      value: answer.value,
    });
    conversationId = last.conversationId;

    if (answer.field && last.step?.field !== answer.field) {
      throw new Error(
        `after ${answer.value}: expected step ${answer.field}, got ${last.step?.field}`,
      );
    }
  }

  if (!last.done) {
    throw new Error("flow did not complete");
  }

  if (!last.whatsappUrl) {
    throw new Error("missing whatsappUrl after completion");
  }

  console.log("hero-api-smoke: passed");
  console.log(`  conversation: ${conversationId}`);
  console.log(`  messages: ${last.messages.length}`);
  console.log(`  whatsapp: ${last.whatsappUrl.slice(0, 40)}...`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
