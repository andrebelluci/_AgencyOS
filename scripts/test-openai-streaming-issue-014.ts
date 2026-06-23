/**
 * ISSUE-014 — OpenAI streaming + SSE + function calling smoke test.
 *
 * Uso:
 *   npm run test:openai-streaming
 *
 * Requer OPENAI_API_KEY em .env.local para testes de integração.
 */
import { formatSSEEvent } from "../src/ai/sse";
import { streamChat } from "../src/ai/stream-chat";
import { SALES_TOOL_DEFINITIONS } from "../src/agents/sales/tool-definitions";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function testSSEFormat(): void {
  const formatted = formatSSEEvent({ type: "token", content: "Olá" });

  assert(
    formatted.startsWith("event: token\n"),
    "SSE event must include event line",
  );
  assert(
    formatted.includes('"content":"Olá"'),
    "SSE event must JSON-encode payload",
  );
  assert(formatted.endsWith("\n\n"), "SSE event must end with blank line");

  console.log("PASS — SSE format encodes token events");
}

async function testTokenStreaming(): Promise<void> {
  const tokens: string[] = [];

  for await (const event of streamChat({
    systemPrompt: "Responda em português com uma frase curta.",
    messages: [{ role: "user", content: "Diga apenas: streaming ok." }],
    maxToolRounds: 1,
  })) {
    if (event.type === "token") {
      tokens.push(event.content);
    }

    if (event.type === "error") {
      throw new Error(event.message);
    }
  }

  const content = tokens.join("").trim().toLowerCase();

  assert(tokens.length > 0, "stream must emit at least one token");
  assert(
    content.includes("streaming") || content.includes("ok"),
    `unexpected streamed content: ${content}`,
  );

  console.log("PASS — token streaming returned content");
  console.log(`      content preview: ${tokens.join("").slice(0, 80)}`);
}

async function testFunctionCalling(): Promise<void> {
  const toolCalls: Array<{ name: string; args: unknown }> = [];
  let sawToolStart = false;
  let sawToolEnd = false;

  for await (const event of streamChat({
    systemPrompt:
      "Você é um assistente de testes. Quando o usuário pedir para registrar um lead, chame createLead com os dados informados.",
    messages: [
      {
        role: "user",
        content:
          "Registre um lead: nome João Teste, email joao@test.local, telefone 19988887777.",
      },
    ],
    tools: SALES_TOOL_DEFINITIONS,
    executeTool: async (name, args) => {
      toolCalls.push({ name, args });
      return { ok: true, tool: name, data: { id: "mock-lead-id" } };
    },
    maxToolRounds: 3,
  })) {
    if (event.type === "tool_call_start") {
      sawToolStart = true;
    }

    if (event.type === "tool_call_end") {
      sawToolEnd = true;
    }

    if (event.type === "error") {
      throw new Error(event.message);
    }
  }

  assert(sawToolStart, "function calling must emit tool_call_start");
  assert(sawToolEnd, "function calling must emit tool_call_end");
  assert(toolCalls.length > 0, "function calling must invoke at least one tool");
  assert(
    toolCalls.some((call) => call.name === "createLead"),
    "sales tools must include createLead invocation",
  );

  console.log("PASS — function calling invoked sales tools");
  console.log(`      tools called: ${toolCalls.map((call) => call.name).join(", ")}`);
}

async function main(): Promise<void> {
  console.log("Agency OS — OpenAI streaming smoke test (ISSUE-014)\n");

  testSSEFormat();

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.log(
      "SKIP — OPENAI_API_KEY not set; integration tests require .env.local",
    );
    console.log("\nOpenAI streaming OK (ISSUE-014) — partial (SSE only).");
    return;
  }

  await testTokenStreaming();
  await testFunctionCalling();

  console.log("\nOpenAI streaming OK (ISSUE-014).");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`FAIL — ${message}`);
  process.exit(1);
});
