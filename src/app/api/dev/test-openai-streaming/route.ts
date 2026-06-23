import { NextResponse } from "next/server";

import { createSSEStream, sseResponse, streamChat } from "@/ai";
import { SALES_TOOL_DEFINITIONS } from "@/agents/sales/tool-definitions";
import { hasOpenAIConfig } from "@/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  if (!hasOpenAIConfig()) {
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "stream";

  if (mode === "tools") {
    const toolCalls: Array<{ name: string; args: unknown }> = [];

    const source = streamChat({
      systemPrompt:
        "Você é um assistente de testes. Quando o usuário pedir para registrar um lead, chame createLead com name, email e phone fictícios.",
      messages: [
        {
          role: "user",
          content:
            "Registre um lead de teste: nome Ana QA, email ana@qa.local, telefone 19999990001.",
        },
      ],
      tools: SALES_TOOL_DEFINITIONS,
      executeTool: async (name, args) => {
        toolCalls.push({ name, args });
        return { ok: true, tool: name, data: { id: "mock-lead-id" } };
      },
      maxToolRounds: 2,
    });

    const events = [];
    let tokenCount = 0;

    for await (const event of source) {
      events.push(event);
      if (event.type === "token") {
        tokenCount += 1;
      }
    }

    return NextResponse.json({
      ok: true,
      issue: "ISSUE-014",
      mode: "tools",
      tokenCount,
      toolCalls,
      events: events.map((event) => event.type),
    });
  }

  const source = streamChat({
    systemPrompt: "Responda em uma frase curta em português.",
    messages: [{ role: "user", content: "Diga apenas: streaming ok." }],
    maxToolRounds: 1,
  });

  const accept = request.headers.get("accept") ?? "";

  if (accept.includes("text/event-stream")) {
    return sseResponse(createSSEStream(source));
  }

  const tokens: string[] = [];

  for await (const event of source) {
    if (event.type === "token") {
      tokens.push(event.content);
    }
  }

  return NextResponse.json({
    ok: true,
    issue: "ISSUE-014",
    mode: "stream",
    content: tokens.join(""),
    tokenCount: tokens.length,
  });
}
