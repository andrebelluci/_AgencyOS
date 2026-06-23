/**
 * Orchestrator has no runtime tools in V0.1 — routing is rule-based.
 * Tool definitions are reserved for future LLM-based classification (V0.2+).
 */

export type OrchestratorToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export const ORCHESTRATOR_TOOL_DEFINITIONS: OrchestratorToolDefinition[] = [];
