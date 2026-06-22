import { z } from "zod";

function emptyToUndefined(value: string | undefined): string | undefined {
  if (value === undefined || value.trim() === "") {
    return undefined;
  }

  return value;
}

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

function formatZodErrors(error: z.ZodError): string {
  const fieldErrors = error.flatten().fieldErrors;
  return Object.entries(fieldErrors)
    .map(([key, messages]) => {
      const list = Array.isArray(messages) ? messages : [];
      return `  ${key}: ${list.join(", ")}`;
    })
    .join("\n");
}

export function getClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Missing or invalid public environment variables:\n${formatZodErrors(parsed.error)}\n\nCopy .env.example to .env.local and fill Supabase keys. See docs/SUPABASE_SETUP.md.`,
    );
  }

  return parsed.data;
}

export function getServerEnv(): ServerEnv & ClientEnv {
  const client = getClientEnv();

  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: emptyToUndefined(process.env.DATABASE_URL),
    OPENAI_API_KEY: emptyToUndefined(process.env.OPENAI_API_KEY),
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    throw new Error(
      `Missing or invalid server environment variables:\n${formatZodErrors(parsed.error)}\n\nCopy .env.example to .env.local and fill Supabase keys. See docs/SUPABASE_SETUP.md.`,
    );
  }

  return { ...client, ...parsed.data };
}

export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
