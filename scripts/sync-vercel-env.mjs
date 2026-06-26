import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function parseEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k !== "VERCEL_OIDC_TOKEN") out[k] = v;
  }
  return out;
}

function run(cmd) {
  execSync(cmd, { stdio: "pipe", encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}

function setEnv(name, value, target) {
  if (!value?.trim()) {
    console.log(`SKIP ${name} (${target})`);
    return;
  }
  try {
    run(`npx vercel env rm ${name} ${target} --yes`);
  } catch {
    /* may not exist for this target */
  }
  const sensitive =
    target === "development" ? "--no-sensitive" : "--sensitive";
  run(
    `npx vercel env add ${name} ${target} --value ${JSON.stringify(value)} --yes --force ${sensitive}`,
  );
  console.log(`OK ${name} -> ${target}`);
}

const prod = parseEnv(".env");
const dev = parseEnv(".env.local");

if (prod.NEXT_PUBLIC_APP_URL) {
  prod.NEXT_PUBLIC_APP_URL = prod.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

const keys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "OPENAI_API_KEY",
  "PLATFORM_ADMIN_EMAILS",
];

for (const key of keys) {
  if (prod[key]) setEnv(key, prod[key], "production");
  if (dev[key]) {
    setEnv(key, dev[key], "preview");
    setEnv(key, dev[key], "development");
  }
}

if (prod.PLATFORM_APEX_TENANT_SLUG) {
  setEnv("PLATFORM_APEX_TENANT_SLUG", prod.PLATFORM_APEX_TENANT_SLUG, "production");
}
if (dev.PLATFORM_APEX_TENANT_SLUG) {
  setEnv("PLATFORM_APEX_TENANT_SLUG", dev.PLATFORM_APEX_TENANT_SLUG, "preview");
  setEnv("PLATFORM_APEX_TENANT_SLUG", dev.PLATFORM_APEX_TENANT_SLUG, "development");
} else {
  for (const target of ["preview", "development"]) {
    setEnv("PLATFORM_APEX_TENANT_SLUG", "development", target);
  }
}

console.log("\nDone.");
