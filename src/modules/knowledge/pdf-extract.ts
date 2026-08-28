import "server-only";

import { CanvasFactory, getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

let workerReady = false;

function ensurePdfWorker(): void {
  if (workerReady) {
    return;
  }

  PDFParse.setWorker(getData());
  workerReady = true;
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  ensurePdfWorker();

  const parser = new PDFParse({ data: buffer, CanvasFactory });

  try {
    const result = await parser.getText();
    return result.text?.replace(/\s+/g, " ").trim() ?? "";
  } finally {
    await parser.destroy();
  }
}
