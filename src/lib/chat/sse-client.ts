import type { StreamChatEvent } from "@/ai/types";

function parseSSEPart(part: string): StreamChatEvent | null {
  const dataLine = part
    .split("\n")
    .find((line) => line.startsWith("data: "))
    ?.slice(6)
    .trim();

  if (!dataLine) {
    return null;
  }

  try {
    return JSON.parse(dataLine) as StreamChatEvent;
  } catch {
    return null;
  }
}

export async function* readChatSSEStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<StreamChatEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const event = parseSSEPart(part);
      if (event) {
        yield event;
      }
    }
  }

  if (buffer.trim()) {
    const event = parseSSEPart(buffer);
    if (event) {
      yield event;
    }
  }
}
