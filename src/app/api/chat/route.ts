import { createSSEStream } from "@/ai/sse";
import {
  corsPreflightResponse,
  jsonWithCors,
  sseWithCors,
} from "@/lib/api/cors";
import { hasOpenAIConfig } from "@/env";
import { chatRequestSchema } from "@/modules/chat/schema";
import {
  ChatApiError,
  prepareChatContext,
  streamChatResponse,
} from "@/modules/chat/service";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonWithCors(
      request,
      {
        error: "Invalid request.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (!hasOpenAIConfig()) {
    return jsonWithCors(
      request,
      { error: "Chat service is not configured." },
      { status: 503 },
    );
  }

  try {
    const context = await prepareChatContext({
      publicKey: parsed.data.public_key,
      message: parsed.data.message,
      conversationId: parsed.data.conversation_id,
      visitorId: parsed.data.visitor_id,
    });

    const stream = createSSEStream(
      streamChatResponse(context, parsed.data.message),
    );

    return sseWithCors(request, stream);
  } catch (error) {
    if (error instanceof ChatApiError) {
      return jsonWithCors(request, { error: error.message }, { status: error.status });
    }

    console.error("[POST /api/chat]", error);

    return jsonWithCors(
      request,
      { error: "Failed to process chat message." },
      { status: 500 },
    );
  }
}
