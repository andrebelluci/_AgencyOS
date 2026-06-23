import type { StreamChatEvent } from "./types";

export function formatSSEEvent(event: StreamChatEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

export function createSSEStream(
  source: AsyncIterable<StreamChatEvent>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of source) {
          controller.enqueue(encoder.encode(formatSSEEvent(event)));
        }
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream failed.";
        controller.enqueue(
          encoder.encode(
            formatSSEEvent({ type: "error", message }),
          ),
        );
        controller.close();
      }
    },
  });
}

export function sseResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
