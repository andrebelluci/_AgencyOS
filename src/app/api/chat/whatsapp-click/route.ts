import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api/cors";
import { whatsappClickRequestSchema } from "@/modules/chat/schema";
import { ChatApiError } from "@/modules/chat/service";
import { recordWhatsAppClick } from "@/modules/chat/whatsapp-click";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

async function parseRequestBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const text = await request.text();
  if (!text.trim()) {
    throw new SyntaxError("Empty body.");
  }

  return JSON.parse(text) as unknown;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await parseRequestBody(request);
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = whatsappClickRequestSchema.safeParse(body);
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
    await recordWhatsAppClick(
      parsed.data.public_key,
      parsed.data.conversation_id,
    );

    return jsonWithCors(request, { ok: true });
  } catch (error) {
    if (error instanceof ChatApiError) {
      return jsonWithCors(request, { error: error.message }, { status: error.status });
    }

    console.error("[POST /api/chat/whatsapp-click]", error);

    return jsonWithCors(
      request,
      { error: "Failed to record WhatsApp click." },
      { status: 500 },
    );
  }
}
