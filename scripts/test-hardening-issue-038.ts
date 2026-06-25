/**
 * QA script for ISSUE-033 (#38) — rate limit, logging, public errors.
 * Requires dev or prod server: npm run dev / npm start
 * Run: npx tsx scripts/test-hardening-issue-038.ts
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const publicKey = process.env.TEST_PUBLIC_KEY ?? "pk_dev_demo";
const ipMax = Number.parseInt(process.env.RATE_LIMIT_IP_MAX ?? "60", 10);
const keyMax = Number.parseInt(process.env.RATE_LIMIT_KEY_MAX ?? "30", 10);
const burst = Math.min(ipMax, keyMax) + 5;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

async function testRateLimitHttp(): Promise<void> {
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
  const statuses: number[] = [];

  for (let i = 0; i < burst; i += 1) {
    const response = await fetch(
      `${baseUrl}/api/widget/config?key=${encodeURIComponent(publicKey)}`,
      {
        headers: { "x-forwarded-for": ip },
      },
    );
    statuses.push(response.status);
  }

  const has429 = statuses.includes(429);
  assert(has429, `expected 429 within ${burst} requests, got: ${statuses.join(",")}`);
  console.log("PASS: HTTP rate limit returns 429");
}

async function testRequestIdHeader(): Promise<void> {
  const response = await fetch(
    `${baseUrl}/api/widget/config?key=${encodeURIComponent(publicKey)}`,
  );
  const requestId = response.headers.get("x-request-id");
  assert(Boolean(requestId), "x-request-id header present");
  console.log("PASS: x-request-id response header");
}

async function testProductionChatError(): Promise<void> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 200) + 50}`,
    },
    body: JSON.stringify({
      public_key: publicKey,
      message: "QA hardening test",
    }),
  });

  const bodyText = await response.text();
  assert(!bodyText.includes("Error:"), "response must not include Error: prefix");
  assert(!bodyText.includes("at "), "response must not include stack trace");
  assert(
    !bodyText.includes("OPENAI_API_KEY"),
    "response must not leak env details",
  );
  console.log("PASS: chat API does not leak stack traces");
}

async function main(): Promise<void> {
  try {
    await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(3000) });
  } catch {
    throw new Error(
      `Server not reachable at ${baseUrl}. Start with npm run dev or npm start.`,
    );
  }

  await testRequestIdHeader();
  await testRateLimitHttp();
  await testProductionChatError();
  console.log("All hardening HTTP checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
