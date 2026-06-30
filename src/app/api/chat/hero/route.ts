import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api/cors";
import {
  beginPublicApiRequest,
  finishPublicApiResponse,
} from "@/lib/api/public-guards";
import {
  logPublicApiError,
  PUBLIC_API_ERRORS,
} from "@/lib/api/public-error";
import { getPublicKeyFromApiRequest } from "@/lib/api/public-key";
import {
  heroChatQuerySchema,
  heroChatRequestSchema,
} from "@/modules/hero/schema";
import {
  getHeroChatState,
  HeroApiError,
  processHeroChat,
} from "@/modules/hero/service";

const ROUTE = "/api/chat/hero";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const publicKey = getPublicKeyFromApiRequest(request);
  const conversationId = new URL(request.url).searchParams
    .get("conversation_id")
    ?.trim();

  const guard = beginPublicApiRequest(request, ROUTE, { publicKey });
  if (!guard.ok) {
    return guard.response;
  }

  const parsed = heroChatQuerySchema.safeParse({
    public_key: publicKey,
    conversation_id: conversationId,
  });

  if (!parsed.success) {
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

  try {
    const result = await getHeroChatState(
      parsed.data.public_key,
      parsed.data.conversation_id,
    );

    const response = jsonWithCors(request, result);
    return finishPublicApiResponse(request, guard.ctx, response);
  } catch (error) {
    if (error instanceof HeroApiError) {
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

  const parsed = heroChatRequestSchema.safeParse(body);
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

  try {
    const result = await processHeroChat({
      publicKey: parsed.data.public_key,
      action: parsed.data.action,
      value: parsed.data.value,
      conversationId: parsed.data.conversation_id,
      visitorId: parsed.data.visitor_id,
    });

    const response = jsonWithCors(request, result);
    return finishPublicApiResponse(request, guard.ctx, response);
  } catch (error) {
    if (error instanceof HeroApiError) {
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
