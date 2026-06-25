export { DEFAULT_CHAT_MODEL, getOpenAIClient } from "./client";
export {
  getOpenAIMetricsSnapshot,
  recordEmbeddingFailure,
  recordEmbeddingJob,
  recordOpenAIChatCall,
  recordOpenAIChatError,
  recordOpenAIChatUsage,
} from "./metrics";
export {
  createQueryEmbedding,
  DEFAULT_EMBEDDING_MODEL,
  formatVectorForPg,
} from "./embeddings";
export { createSSEStream, formatSSEEvent, sseResponse } from "./sse";
export { streamSalesAgent } from "./sales-stream";
export { streamChat } from "./stream-chat";
export type {
  ChatMessage,
  OpenAIToolDefinition,
  StreamChatEvent,
  StreamChatOptions,
  ToolExecutor,
} from "./types";
