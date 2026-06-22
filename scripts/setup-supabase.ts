/**
 * ISSUE-002 — Verifica conexão Supabase e cria bucket `knowledge`.
 *
 * Uso: npm run supabase:setup
 * Requer .env.local com chaves Supabase (ver docs/SUPABASE_SETUP.md).
 */
import {
  checkSupabaseConnection,
  ensureKnowledgeBucket,
} from "../src/lib/supabase/check-connection";

async function main() {
  console.log("Agency OS — Supabase setup (ISSUE-002)\n");

  const status = await checkSupabaseConnection();

  console.log("Auth API:", status.auth.ok ? "OK" : `FAIL — ${status.auth.error}`);
  console.log(
    "Storage API:",
    status.storage.ok
      ? `OK (${status.storage.buckets.length} bucket(s))`
      : `FAIL — ${status.storage.error}`,
  );

  if (!status.auth.ok || !status.storage.ok) {
    console.error("\nConexão falhou. Verifique .env.local e docs/SUPABASE_SETUP.md.");
    process.exit(1);
  }

  const bucket = await ensureKnowledgeBucket();
  console.log(
    bucket.created
      ? `\nBucket "${bucket.bucket}" criado.`
      : `\nBucket "${bucket.bucket}" já existe.`,
  );

  const final = await checkSupabaseConnection();
  if (!final.knowledgeBucket.exists) {
    console.error("\nBucket knowledge não encontrado após setup.");
    process.exit(1);
  }

  console.log("\nSetup concluído. Conexão testada; bucket knowledge pronto.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  process.exit(1);
});
