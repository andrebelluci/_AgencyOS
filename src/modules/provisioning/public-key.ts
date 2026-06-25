import { randomBytes } from "node:crypto";

const PUBLIC_KEY_PREFIX = "pk_";
const PUBLIC_KEY_BYTES = 24;

/**
 * Generates a cryptographically secure public_key for widget/API identification.
 */
export function generatePublicKey(): string {
  return `${PUBLIC_KEY_PREFIX}${randomBytes(PUBLIC_KEY_BYTES).toString("base64url")}`;
}
