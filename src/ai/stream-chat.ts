import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";

import { PUBLIC_API_ERRORS } from "@/lib/api/public-error";

import { DEFAULT_CHAT_MODEL, getOpenAIClient } from "./client";
import {
  recordOpenAIChatCall,
  recordOpenAIChatError,
  recordOpenAIChatUsage,
} from "./metrics";
import type {
  OpenAIToolDefinition,
  StreamChatEvent,
  StreamChatOptions,
} from "./types";

type AccumulatedToolCall = {
  id: string;
  name: string;
  arguments: string;
};

const DEFAULT_MAX_TOOL_ROUNDS = 5;

function toOpenAITools(
  tools: OpenAIToolDefinition[] | undefined,
): ChatCompletionTool[] | undefined {
  if (!tools || tools.length === 0) {
    return undefined;
  }

  return tools as ChatCompletionTool[];
}

function buildMessages(
  systemPrompt: string,
  messages: StreamChatOptions["messages"],
): ChatCompletionMessageParam[] {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map(
      (message) =>
        ({
          role: message.role,
          content: message.content,
        }) satisfies ChatCompletionMessageParam,
    ),
  ];
}

function accumulateToolCallDelta(
  accumulated: Map<number, AccumulatedToolCall>,
  index: number,
  id?: string,
  name?: string,
  argumentChunk?: string,
): void {
  const current = accumulated.get(index) ?? {
    id: id ?? "",
    name: name ?? "",
    arguments: "",
  };

  if (id) {
    current.id = id;
  }

  if (name) {
    current.name = name;
  }

  if (argumentChunk) {
    current.arguments += argumentChunk;
  }

  accumulated.set(index, current);
}

export async function* streamChat(
  options: StreamChatOptions,
): AsyncGenerator<StreamChatEvent> {
  const client = getOpenAIClient();
  const model = options.model ?? DEFAULT_CHAT_MODEL;
  const maxToolRounds = options.maxToolRounds ?? DEFAULT_MAX_TOOL_ROUNDS;
  const tools = toOpenAITools(options.tools);
  const executeTool = options.executeTool;

  let messages = buildMessages(options.systemPrompt, options.messages);
  let finalContent = "";

  for (let round = 0; round < maxToolRounds; round += 1) {
    let stream;

    try {
      recordOpenAIChatCall(model);
      stream = await client.chat.completions.create({
        model,
        messages,
        tools,
        stream: true,
        stream_options: { include_usage: true },
      });
    } catch (error) {
      recordOpenAIChatError(model, error);
      yield {
        type: "error",
        message: PUBLIC_API_ERRORS.streamFailed,
      };
      return;
    }

    let roundContent = "";
    const toolCalls = new Map<number, AccumulatedToolCall>();

    try {
      for await (const chunk of stream) {
        if (chunk.usage) {
          recordOpenAIChatUsage(model, {
            promptTokens: chunk.usage.prompt_tokens,
            completionTokens: chunk.usage.completion_tokens,
            totalTokens: chunk.usage.total_tokens,
          });
        }

        const choice = chunk.choices[0];
        const delta = choice?.delta;

        if (!delta) {
          continue;
        }

        if (delta.content) {
          roundContent += delta.content;
          yield { type: "token", content: delta.content };
        }

        if (delta.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            accumulateToolCallDelta(
              toolCalls,
              toolCall.index,
              toolCall.id,
              toolCall.function?.name,
              toolCall.function?.arguments,
            );
          }
        }
      }
    } catch (error) {
      recordOpenAIChatError(model, error);
      yield {
        type: "error",
        message: PUBLIC_API_ERRORS.streamFailed,
      };
      return;
    }

    finalContent += roundContent;
    const completedToolCalls = [...toolCalls.values()].filter(
      (toolCall) => toolCall.id && toolCall.name,
    );

    if (completedToolCalls.length === 0 || !executeTool) {
      yield { type: "done", content: finalContent };
      return;
    }

    messages = [
      ...messages,
      {
        role: "assistant",
        content: roundContent || null,
        tool_calls: completedToolCalls.map((toolCall) => ({
          id: toolCall.id,
          type: "function" as const,
          function: {
            name: toolCall.name,
            arguments: toolCall.arguments,
          },
        })),
      },
    ];

    const toolMessages: ChatCompletionMessageParam[] = [];

    for (const toolCall of completedToolCalls) {
      yield {
        type: "tool_call_start",
        id: toolCall.id,
        name: toolCall.name,
      };

      let parsedArgs: unknown = {};

      if (toolCall.arguments.trim()) {
        try {
          parsedArgs = JSON.parse(toolCall.arguments);
        } catch {
          parsedArgs = {};
        }
      }

      const result = await executeTool(toolCall.name, parsedArgs);

      yield {
        type: "tool_call_end",
        id: toolCall.id,
        name: toolCall.name,
        result,
      };

      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    messages = [...messages, ...toolMessages];
    finalContent = "";
  }

  yield {
    type: "error",
    message: `Exceeded maximum tool rounds (${maxToolRounds}).`,
  };
}
