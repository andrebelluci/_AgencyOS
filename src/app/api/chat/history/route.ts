import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api/cors";
import { chatHistoryQuerySchema } from "@/modules/chat/schema";
import { ChatApiError, getChatHistory } from "@/modules/chat/service";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = chatHistoryQuerySchema.safeParse({
    public_key: searchParams.get("public_key") ?? undefined,
    conversation_id: searchParams.get("conversation_id") ?? undefined,
  });

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

  try {
    const history = await getChatHistory(
      parsed.data.public_key,
      parsed.data.conversation_id,
    );

    return jsonWithCors(request, {
      conversation_id: history.conversationId,
      messages: history.messages,
      whatsapp_url: history.whatsappUrl,
    });
  } catch (error) {
    if (error instanceof ChatApiError) {
      return jsonWithCors(request, { error: error.message }, { status: error.status });
    }

    console.error("[GET /api/chat/history]", error);

    return jsonWithCors(
      request,
      { error: "Failed to load conversation history." },
      { status: 500 },
    );
  }
}
