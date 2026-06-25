import { createSSEStream } from "@/ai/sse";
import {
  corsPreflightResponse,
  jsonWithCors,
  sseWithCors,
} from "@/lib/api/cors";
import {
  beginPublicApiRequest,
  finishPublicApiResponse,
} from "@/lib/api/public-guards";
import {
  logPublicApiError,
  PUBLIC_API_ERRORS,
} from "@/lib/api/public-error";
import { hasOpenAIConfig } from "@/env";
import { chatRequestSchema } from "@/modules/chat/schema";
import {
  ChatApiError,
  prepareChatContext,
  streamChatResponse,
} from "@/modules/chat/service";

const ROUTE = "/api/chat";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const guard = beginPublicApiRequest(request, ROUTE);
    if (!guard.ok) {
      return guard.response;
    }

    const response = jsonWithCors(
      request,
      { error: "Invalid JSON body." },
      { status: 400 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const guard = beginPublicApiRequest(request, ROUTE, {
      publicKey:
        typeof body === "object" &&
        body !== null &&
        "public_key" in body &&
        typeof (body as { public_key?: unknown }).public_key === "string"
          ? (body as { public_key: string }).public_key
          : null,
    });
    if (!guard.ok) {
      return guard.response;
    }

    const response = jsonWithCors(
      request,
      {
        error: "Invalid request.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }

  const guard = beginPublicApiRequest(request, ROUTE, {
    publicKey: parsed.data.public_key,
  });
  if (!guard.ok) {
    return guard.response;
  }

  if (!hasOpenAIConfig()) {
    const response = jsonWithCors(
      request,
      { error: "Chat service is not configured." },
      { status: 503 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }

  try {
    const context = await prepareChatContext({
      publicKey: parsed.data.public_key,
      message: parsed.data.message,
      conversationId: parsed.data.conversation_id,
      visitorId: parsed.data.visitor_id,
    });

    guard.ctx.tenantId = context.tenantId;

    const stream = createSSEStream(
      streamChatResponse(context, parsed.data.message),
      {
        requestId: guard.ctx.requestId,
        tenantId: context.tenantId,
        route: ROUTE,
      },
    );

    const response = sseWithCors(request, stream);
    return finishPublicApiResponse(request, guard.ctx, response, 200, {
      stream: true,
    });
  } catch (error) {
    if (error instanceof ChatApiError) {
      const response = jsonWithCors(
        request,
        { error: error.message },
        { status: error.status },
      );
      return finishPublicApiResponse(request, guard.ctx, response);
    }

    logPublicApiError(ROUTE, error, {
      requestId: guard.ctx.requestId,
      tenantId: guard.ctx.tenantId,
    });

    const response = jsonWithCors(
      request,
      { error: PUBLIC_API_ERRORS.chatFailed },
      { status: 500 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }
}
