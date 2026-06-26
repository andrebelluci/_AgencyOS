import "server-only";

/** pdf-parse v2 (PDF.js) expects browser DOM APIs on Node serverless. */
export async function ensurePdfDomPolyfill(): Promise<void> {
  if (typeof globalThis.DOMMatrix !== "undefined") {
    return;
  }

  const dommatrix = await import("@thednp/dommatrix");
  globalThis.DOMMatrix = dommatrix.default as typeof DOMMatrix;
}
