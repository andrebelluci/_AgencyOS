const EMBED_SCRIPT_PATH = "/widget/embed.js";

export function buildEmbedScriptUrl(appUrl: string): string {
  const base = appUrl.replace(/\/$/, "");
  return `${base}${EMBED_SCRIPT_PATH}`;
}

export function buildEmbedScriptSnippet(
  appUrl: string,
  publicKey: string,
): string {
  const scriptUrl = buildEmbedScriptUrl(appUrl);
  return `<script src="${scriptUrl}" data-key="${publicKey}"></script>`;
}
