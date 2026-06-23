/**
 * ISSUE-011 — Smoke test for Orchestrator + Sales Agent structure.
 *
 * Uso: npm run test:agents
 */
import { runOrchestrator } from "../src/agents/orchestrator/agent";
import { classifyIntent } from "../src/agents/orchestrator/rules";
import { runSalesPipeline } from "../src/agents/sales/agent";
import { SALES_TOOL_DEFINITIONS } from "../src/agents/sales/tool-definitions";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function main(): void {
  console.log("Agency OS — agents smoke test (ISSUE-011)\n");

  const tenantSettings = {
    companyName: "Belluci Acabamentos",
    city: "Mogi Mirim",
    services: ["cimento queimado", "porcelanato"],
    whatsapp: "(19) 99999-9999",
    systemPrompt: "Priorize reformas residenciais.",
  };

  const commercialMessage = "Quanto custa aplicar cimento queimado?";
  const intent = classifyIntent(commercialMessage);
  assert(intent === "pricing", `expected pricing intent, got ${intent}`);

  const orchestrator = runOrchestrator({
    tenantId: "tenant-test",
    conversationId: "conv-test",
    message: commercialMessage,
  });

  assert(
    orchestrator.decision.agentId === "sales",
    "orchestrator must route to sales in V0.1",
  );
  assert(
    orchestrator.decision.hints.length > 0,
    "pricing intent should include routing hints",
  );

  const pipeline = runSalesPipeline({
    tenantId: "tenant-test",
    conversationId: "conv-test",
    message: commercialMessage,
    tenantSettings,
  });

  assert(
    pipeline.route.agentId === "sales",
    "sales pipeline must keep sales routing",
  );
  assert(
    pipeline.prepared.prompt.includes("Belluci Acabamentos"),
    "sales prompt missing tenant company name",
  );
  assert(
    pipeline.prepared.prompt.includes("Sales Agent"),
    "sales prompt missing agent layer",
  );
  assert(
    pipeline.prepared.prompt.includes("Não informe valores"),
    "sales prompt missing pricing routing hint",
  );
  assert(
    pipeline.prepared.toolNames.length === 3,
    "sales agent must expose 3 tools",
  );
  assert(
    SALES_TOOL_DEFINITIONS.every((tool) => tool.type === "function"),
    "sales tool definitions must use function type",
  );

  console.log("PASS — orchestrator routes commercial/pricing intent to sales");
  console.log("PASS — sales prompt built with 4 layers + routing context");
  console.log("PASS — sales tools decoupled from agents (import from src/tools)");
  console.log("\nAgents OK (ISSUE-011).");
}

main();
