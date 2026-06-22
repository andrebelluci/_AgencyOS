import { createAdminClient } from "@/lib/supabase/admin-client";
import { KNOWLEDGE_BUCKET } from "@/lib/supabase/constants";

export type SupabaseConnectionStatus = {
  configured: true;
  auth: { ok: boolean; error?: string };
  storage: { ok: boolean; buckets: string[]; error?: string };
  knowledgeBucket: { exists: boolean };
};

export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const supabase = createAdminClient();

  const { error: authError } = await supabase.auth.getSession();
  const { data: buckets, error: storageError } =
    await supabase.storage.listBuckets();

  const bucketNames = buckets?.map((bucket) => bucket.name) ?? [];

  return {
    configured: true,
    auth: {
      ok: !authError,
      ...(authError ? { error: authError.message } : {}),
    },
    storage: {
      ok: !storageError,
      buckets: bucketNames,
      ...(storageError ? { error: storageError.message } : {}),
    },
    knowledgeBucket: {
      exists: bucketNames.includes(KNOWLEDGE_BUCKET),
    },
  };
}

export async function ensureKnowledgeBucket(): Promise<{
  created: boolean;
  bucket: string;
}> {
  const supabase = createAdminClient();
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  if (buckets?.some((bucket) => bucket.name === KNOWLEDGE_BUCKET)) {
    return { created: false, bucket: KNOWLEDGE_BUCKET };
  }

  const { error: createError } = await supabase.storage.createBucket(
    KNOWLEDGE_BUCKET,
    {
      public: false,
      fileSizeLimit: 52_428_800,
      allowedMimeTypes: [
        "application/pdf",
        "text/plain",
        "text/markdown",
      ],
    },
  );

  if (createError) {
    throw new Error(
      `Failed to create bucket "${KNOWLEDGE_BUCKET}": ${createError.message}`,
    );
  }

  return { created: true, bucket: KNOWLEDGE_BUCKET };
}
