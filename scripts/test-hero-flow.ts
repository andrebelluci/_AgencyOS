/**
 * ISSUE-036 (#42) — Unit checks for hero flow state machine (no DB).
 */
import assert from "node:assert/strict";

import {
  buildDefaultHeroFlowConfig,
  getCurrentRuntimeStep,
  isHeroFlowComplete,
  resolveHeroFlowConfig,
  validateHeroAnswer,
} from "../src/lib/widget/hero-flow";

function testDefaultFlowSteps() {
  const config = buildDefaultHeroFlowConfig(["Pintura", "Reforma"]);
  assert.equal(config.steps.length, 5);
  assert.equal(config.steps[0]?.field, "service");
  assert.equal(config.steps[0]?.options?.length, 2);
}

function testStepProgression() {
  const config = buildDefaultHeroFlowConfig();
  const answers = {};

  const first = getCurrentRuntimeStep(config, answers, []);
  assert.equal(first?.field, "service");

  const afterService = getCurrentRuntimeStep(
    config,
    { service: "reforma" },
    [],
  );
  assert.equal(afterService?.field, "city");

  const completeAnswers = {
    service: "reforma",
    city: "Campinas",
    deadline: "30_dias",
    name: "Maria",
    phone: "19999998888",
  };

  assert.equal(isHeroFlowComplete(config, completeAnswers), true);
  assert.equal(getCurrentRuntimeStep(config, completeAnswers, []), null);
}

function testValidation() {
  assert.equal(validateHeroAnswer("phone", "123"), "Informe um telefone válido.");
  assert.equal(validateHeroAnswer("phone", "(19) 99999-8888"), null);
  assert.equal(validateHeroAnswer("name", "A"), "Informe seu nome.");
}

function testResolveConfig() {
  const resolved = resolveHeroFlowConfig(
    {
      enabled: true,
      welcomeMessage: "Oi!",
      completionMessage: "Obrigado!",
      steps: [],
    },
    ["Acabamento"],
  );

  assert.equal(resolved.welcomeMessage, "Oi!");
  assert.equal(resolved.steps.length, 5);
  assert.equal(resolved.steps[0]?.options?.[0]?.label, "Acabamento");
}

function main() {
  testDefaultFlowSteps();
  testStepProgression();
  testValidation();
  testResolveConfig();
  console.log("hero-flow: all checks passed");
}

main();
