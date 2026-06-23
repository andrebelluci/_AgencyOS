import {
  classifyIntent,
  ORCHESTRATOR_RULES,
  routingHintsForIntent,
} from "./rules";
import type {
  AgentId,
  OrchestratorInput,
  OrchestratorResult,
  RouteDecision,
} from "./types";

const DEFAULT_AGENT_ID: AgentId = "sales";

function buildRouteReason(intent: RouteDecision["intent"]): string {
  switch (intent) {
    case "pricing":
      return "Intenção de preço detectada — encaminhado ao Sales Agent com restrição de valores.";
    case "support":
      return "Intenção de suporte detectada — encaminhado ao Sales Agent para atendimento com base de conhecimento.";
    case "commercial":
      return "Intenção comercial detectada — encaminhado ao Sales Agent.";
    case "general":
      return "Mensagem geral — encaminhada ao Sales Agent para condução comercial.";
  }
}

export function routeToAgent(input: OrchestratorInput): RouteDecision {
  const intent = classifyIntent(input.message);
  const hints = routingHintsForIntent(intent);

  return {
    agentId: DEFAULT_AGENT_ID,
    intent,
    reason: buildRouteReason(intent),
    hints,
  };
}

export function runOrchestrator(input: OrchestratorInput): OrchestratorResult {
  const decision = routeToAgent(input);

  return { decision };
}

export function getOrchestratorRules(): readonly string[] {
  return ORCHESTRATOR_RULES;
}
