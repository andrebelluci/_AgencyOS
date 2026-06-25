import "server-only";

import { logStructured } from "@/lib/logging";

export type OpenAIChatUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

type OpenAIMetricsSnapshot = {
  chatCalls: number;
  chatErrors: number;
  chatTokens: number;
  embeddingJobs: number;
  embeddingFailures: number;
  embeddingVectors: number;
};

const metrics: OpenAIMetricsSnapshot = {
  chatCalls: 0,
  chatErrors: 0,
  chatTokens: 0,
  embeddingJobs: 0,
  embeddingFailures: 0,
  embeddingVectors: 0,
};

function emitMetric(
  message: string,
  fields: Record<string, unknown>,
): void {
  logStructured({
    level: "info",
    message,
    metric: true,
    ...fields,
  });
}

export function recordOpenAIChatCall(model: string): void {
  metrics.chatCalls += 1;
  emitMetric("openai_chat_call", { model, chat_calls: metrics.chatCalls });
}

export function recordOpenAIChatUsage(
  model: string,
  usage: OpenAIChatUsage,
): void {
  const total = usage.totalTokens ?? 0;
  metrics.chatTokens += total;

  emitMetric("openai_chat_usage", {
    model,
    prompt_tokens: usage.promptTokens,
    completion_tokens: usage.completionTokens,
    total_tokens: usage.totalTokens,
    chat_tokens_total: metrics.chatTokens,
  });
}

export function recordOpenAIChatError(
  model: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  metrics.chatErrors += 1;

  const errorMessage =
    error instanceof Error ? error.message : String(error);

  logStructured({
    level: "error",
    message: "openai_chat_error",
    metric: true,
    model,
    error_message: errorMessage,
    chat_errors: metrics.chatErrors,
    ...context,
  });
}

export function recordEmbeddingJob(inputCount: number): void {
  metrics.embeddingJobs += 1;
  metrics.embeddingVectors += inputCount;

  emitMetric("openai_embedding_job", {
    input_count: inputCount,
    embedding_jobs: metrics.embeddingJobs,
    embedding_vectors: metrics.embeddingVectors,
  });
}

export function recordEmbeddingFailure(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  metrics.embeddingFailures += 1;

  const errorMessage =
    error instanceof Error ? error.message : String(error);

  logStructured({
    level: "error",
    message: "openai_embedding_failure",
    metric: true,
    error_message: errorMessage,
    embedding_failures: metrics.embeddingFailures,
    ...context,
  });
}

export function getOpenAIMetricsSnapshot(): Readonly<OpenAIMetricsSnapshot> {
  return { ...metrics };
}

export function resetOpenAIMetricsForTests(): void {
  metrics.chatCalls = 0;
  metrics.chatErrors = 0;
  metrics.chatTokens = 0;
  metrics.embeddingJobs = 0;
  metrics.embeddingFailures = 0;
  metrics.embeddingVectors = 0;
}
