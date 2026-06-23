export const V01_AGENT_IDS = ["sales"] as const;

export type AgentId = (typeof V01_AGENT_IDS)[number];

export type UserIntent =
  | "commercial"
  | "pricing"
  | "support"
  | "general";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type RouteDecision = {
  agentId: AgentId;
  intent: UserIntent;
  reason: string;
  hints: string[];
};

export type OrchestratorInput = {
  tenantId: string;
  conversationId: string;
  message: string;
  history?: ConversationMessage[];
};

export type OrchestratorResult = {
  decision: RouteDecision;
};
