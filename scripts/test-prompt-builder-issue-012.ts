/**
 * ISSUE-012 — Smoke test for four-layer prompt builder.
 *
 * Uso: npm run test:prompt-builder
 */
import {
  buildPrompt,
  buildPromptLayers,
  buildTenantPrompt,
  tenantPromptContextFromSettings,
} from "../src/agents/shared/prompt-builder";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function main(): void {
  console.log("Agency OS — prompt builder smoke test (ISSUE-012)\n");

  const tenant = tenantPromptContextFromSettings({
    companyName: "Belluci Acabamentos",
    city: "Mogi Mirim",
    services: ["cimento queimado", "porcelanato"],
    whatsapp: "(19) 99999-9999",
    systemPrompt: "Priorize reformas residenciais.",
  });

  const agentPrompt =
    "Você é o Sales Agent. Capture leads e qualifique oportunidades comerciais.";

  const layers = buildPromptLayers({ tenant, agentPrompt });
  const prompt = buildPrompt({ tenant, agentPrompt });

  assert(layers.system.length > 0, "system layer is empty");
  assert(layers.platform.length > 0, "platform layer is empty");
  assert(
    layers.tenant.includes("Belluci Acabamentos"),
    "tenant layer missing company name",
  );
  assert(layers.tenant.includes("Mogi Mirim"), "tenant layer missing city");
  assert(
    layers.tenant.includes("cimento queimado"),
    "tenant layer missing services",
  );
  assert(
    layers.tenant.includes("Priorize reformas residenciais."),
    "tenant layer missing custom instructions from tenant_settings",
  );
  assert(layers.agent.includes("Sales Agent"), "agent layer missing content");

  assert(prompt.includes(layers.system), "final prompt missing system layer");
  assert(prompt.includes(layers.platform), "final prompt missing platform layer");
  assert(
    prompt.includes("Belluci Acabamentos"),
    "final prompt missing tenant data",
  );
  assert(prompt.includes("Sales Agent"), "final prompt missing agent layer");

  const updatedTenant = buildTenantPrompt({
    ...tenant,
    companyName: "Outra Empresa LTDA",
  });
  assert(
    updatedTenant.includes("Outra Empresa LTDA"),
    "tenant prompt is not dynamic",
  );
  assert(
    !updatedTenant.includes("Belluci Acabamentos"),
    "tenant prompt still contains previous company name",
  );

  console.log("PASS — 4 layers built (system, platform, tenant, agent)");
  console.log("PASS — tenant_settings data injected dynamically");
  console.log("\nPrompt builder OK (ISSUE-012).");
}

main();
