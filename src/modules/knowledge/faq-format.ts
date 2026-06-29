const FAQ_ANSWER_MARKER = "\n\nResposta:\n";

export function formatFaqChunkContent(question: string, answer: string): string {
  const q = question.trim();
  const a = answer.trim();

  return `Pergunta:\n${q}\n\nResposta:\n${a}`;
}

/** Extracts display answer from indexed FAQ chunk (legacy chunks pass through). */
export function parseFaqAnswerFromChunk(content: string): string {
  const markerIndex = content.indexOf(FAQ_ANSWER_MARKER);
  if (markerIndex >= 0) {
    return content.slice(markerIndex + FAQ_ANSWER_MARKER.length).trim();
  }

  return content.trim();
}
