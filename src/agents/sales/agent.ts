import {
  buildPrompt,
  tenantPromptContextFromSettings,
} from "@/agents/shared/prompt-builder";

import { runOrchestrator } from "../orchestrator/agent";
import type { OrchestratorInput } from "../orchestrator/types";

import { SALES_AGENT_PROMPT } from "./prompt";
import { formatSalesRules, SALES_RULES } from "./rules";
import { getSalesToolNames, SALES_TOOL_DEFINITIONS } from "./tool-definitions";
import type { SalesAgentInput, SalesAgentPrepared } from "./types";

function buildRoutingContext(
  routing: SalesAgentInput["routing"],
): string | null {
  if (!routing) {
    return null;
  }

  const lines = [
    "## Contexto do Orchestrator",
    `Intenção detectada: ${routing.intent}`,
    `Motivo do roteamento: ${routing.reason}`,
  ];

  if (routing.hints.length > 0) {
    lines.push("", "Orientações:");
    for (const hint of routing.hints) {
      lines.push(`- ${hint}`);
    }
  }

  return lines.join("\n");
}

function buildAgentPromptWithRules(): string {
  return [SALES_AGENT_PROMPT, "", "## Regras operacionais", formatSalesRules()].join(
    "\n",
  );
}

export function prepareSalesAgent(input: SalesAgentInput): SalesAgentPrepared {
  const tenant = tenantPromptContextFromSettings(input.tenantSettings);
  const agentPrompt = buildAgentPromptWithRules();
  const routingContext = buildRoutingContext(input.routing);

  const prompt = buildPrompt({
    tenant,
    agentPrompt: routingContext
      ? `${agentPrompt}\n\n${routingContext}`
      : agentPrompt,
  });

  return {
    prompt,
    rules: SALES_RULES,
    toolNames: getSalesToolNames(),
    routingContext,
  };
}

export type SalesPipelineInput = OrchestratorInput & {
  leadId?: string | null;
  tenantSettings: SalesAgentInput["tenantSettings"];
};

export type SalesPipelineResult = {
  route: ReturnType<typeof runOrchestrator>["decision"];
  prepared: SalesAgentPrepared;
};

/**
 * Full V0.1 pipeline: Orchestrator routes intent → Sales builds layered prompt.
 */
export function runSalesPipeline(input: SalesPipelineInput): SalesPipelineResult {
  const { decision } = runOrchestrator(input);

  const prepared = prepareSalesAgent({
    tenantId: input.tenantId,
    conversationId: input.conversationId,
    message: input.message,
    leadId: input.leadId,
    tenantSettings: input.tenantSettings,
    routing: {
      intent: decision.intent,
      hints: decision.hints,
      reason: decision.reason,
    },
  });

  return {
    route: decision,
    prepared,
  };
}

export { SALES_TOOL_DEFINITIONS };
