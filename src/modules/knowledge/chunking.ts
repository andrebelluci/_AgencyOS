import "server-only";

/** ~750 tokens at ~4 chars/token */
const CHUNK_TARGET_CHARS = 3_000;

/** ~1000 tokens */
const CHUNK_MAX_CHARS = 4_000;

const MIN_CHUNK_CHARS = 80;

function splitOversizedParagraph(text: string, maxChars: number): string[] {
  const parts: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length);

    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > start + MIN_CHUNK_CHARS) {
        end = lastSpace;
      }
    }

    const slice = text.slice(start, end).trim();
    if (slice.length > 0) {
      parts.push(slice);
    }

    start = end;
  }

  return parts;
}

export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  if (normalized.length <= CHUNK_MAX_CHARS) {
    return [normalized];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    const trimmed = current.trim();
    if (trimmed.length >= MIN_CHUNK_CHARS) {
      chunks.push(trimmed);
    } else if (trimmed.length > 0 && chunks.length > 0) {
      chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${trimmed}`;
    } else if (trimmed.length > 0) {
      chunks.push(trimmed);
    }
    current = "";
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > CHUNK_MAX_CHARS) {
      flush();
      chunks.push(...splitOversizedParagraph(paragraph, CHUNK_MAX_CHARS));
      continue;
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length > CHUNK_TARGET_CHARS && current) {
      flush();
      current = paragraph;
    } else {
      current = candidate;
    }
  }

  flush();

  if (chunks.length === 0 && normalized.length > 0) {
    return splitOversizedParagraph(normalized, CHUNK_MAX_CHARS);
  }

  return chunks;
}
