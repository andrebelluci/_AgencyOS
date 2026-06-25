import "server-only";

import { buildWhatsAppLink } from "@/tools/build-whatsapp-link";
import { createLead } from "@/tools/create-lead";
import { searchKnowledge } from "@/tools/search-knowledge";
import { updateLead } from "@/tools/update-lead";

import type { SalesToolExecutionResult, SalesToolName } from "./types";

export { getSalesToolNames, SALES_TOOL_DEFINITIONS } from "./tool-definitions";
export type { SalesToolDefinition } from "./tool-definitions";

export async function executeSalesTool(
  tenantId: string,
  toolName: SalesToolName,
  args: unknown,
): Promise<SalesToolExecutionResult> {
  switch (toolName) {
    case "createLead": {
      const result = await createLead(tenantId, args);
      if (!result.ok) {
        return { ok: false, tool: toolName, error: result.error };
      }
      return { ok: true, tool: toolName, data: result.data };
    }
    case "updateLead": {
      const result = await updateLead(tenantId, args);
      if (!result.ok) {
        return { ok: false, tool: toolName, error: result.error };
      }
      return { ok: true, tool: toolName, data: result.data };
    }
    case "buildWhatsAppLink": {
      const result = buildWhatsAppLink(args);
      if (!result.ok) {
        return { ok: false, tool: toolName, error: result.error };
      }
      return { ok: true, tool: toolName, data: { url: result.url } };
    }
    case "searchKnowledge": {
      const result = await searchKnowledge(tenantId, args);
      if (!result.ok) {
        return { ok: false, tool: toolName, error: result.error };
      }
      return { ok: true, tool: toolName, data: result.data };
    }
  }
}
