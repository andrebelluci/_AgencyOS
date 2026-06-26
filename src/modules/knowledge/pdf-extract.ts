import "server-only";

import { ensurePdfDomPolyfill } from "./pdf-dom-polyfill";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  await ensurePdfDomPolyfill();
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text?.replace(/\s+/g, " ").trim() ?? "";
  } finally {
    await parser.destroy();
  }
}
