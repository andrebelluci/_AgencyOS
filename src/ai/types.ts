import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export type ChatRole = "system" | "user" | "assistant" | "tool";

export type ChatMessage = ChatCompletionMessageParam;

export type OpenAIToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ToolExecutor = (
  name: string,
  args: unknown,
) => Promise<unknown>;

export type StreamChatEvent =
  | { type: "token"; content: string }
  | { type: "tool_call_start"; id: string; name: string }
  | { type: "tool_call_end"; id: string; name: string; result: unknown }
  | { type: "done"; content: string }
  | { type: "error"; message: string };

export type StreamChatOptions = {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  tools?: OpenAIToolDefinition[];
  executeTool?: ToolExecutor;
  model?: string;
  maxToolRounds?: number;
};
