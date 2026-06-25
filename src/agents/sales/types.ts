import type { TenantSettingsPromptSource } from "@/agents/shared/prompt-builder";

import type { RouteDecision } from "../orchestrator/types";

export type SalesAgentInput = {
  tenantId: string;
  conversationId: string;
  message: string;
  leadId?: string | null;
  tenantSettings: TenantSettingsPromptSource;
  routing?: Pick<RouteDecision, "intent" | "hints" | "reason">;
};

export type SalesAgentPrepared = {
  prompt: string;
  rules: readonly string[];
  toolNames: string[];
  routingContext: string | null;
};

export type SalesToolName =
  | "createLead"
  | "updateLead"
  | "buildWhatsAppLink"
  | "searchKnowledge";

export type SalesToolExecutionResult =
  | { ok: true; tool: SalesToolName; data: unknown }
  | { ok: false; tool: SalesToolName; error: string };
