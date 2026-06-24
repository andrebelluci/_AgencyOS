import "server-only";

import type { Lead } from "@/lib/db";
import { updateConversation } from "@/modules/conversations/service";

import { runSalesPipeline } from "@/agents/sales/agent";
import { SALES_TOOL_DEFINITIONS } from "@/agents/sales/tool-definitions";
import { executeSalesTool } from "@/agents/sales/tools";
import type { SalesPipelineInput } from "@/agents/sales/agent";
import type { SalesToolName } from "@/agents/sales/types";

import { streamChat } from "./stream-chat";
import type { StreamChatEvent } from "./types";

export type SalesStreamInput = SalesPipelineInput & {
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

export async function* streamSalesAgent(
  input: SalesStreamInput,
): AsyncGenerator<StreamChatEvent> {
  const { prepared } = runSalesPipeline(input);

  const messages = [
    ...(input.history ?? []),
    { role: "user" as const, content: input.message },
  ];

  yield* streamChat({
    systemPrompt: prepared.prompt,
    messages,
    tools: SALES_TOOL_DEFINITIONS,
    executeTool: async (name, args) => {
      const result = await executeSalesTool(
        input.tenantId,
        name as SalesToolName,
        args,
      );

      if (
        result.ok &&
        result.tool === "createLead" &&
        result.data &&
        typeof result.data === "object" &&
        "id" in result.data
      ) {
        await updateConversation(input.tenantId, input.conversationId, {
          leadId: (result.data as Lead).id,
        });
      }

      return result;
    },
  });
}
