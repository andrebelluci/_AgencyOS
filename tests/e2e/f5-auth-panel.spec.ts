import type { Page } from "@playwright/test";

import {
  DEV_ASSISTANT_LABEL,
  DEV_COMPANY_NAME,
  DEV_PUBLIC_KEY,
} from "./constants";
import { expect, test } from "./fixtures";

test.describe("F5 — Auth + Painel @f5 @smoke", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("owner login reaches dashboard with metrics", async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await loginPage.goto("/dashboard");
    await loginPage.login();
    await page.waitForURL("**/dashboard");
    await dashboardPage.expectLoaded();
  });
});

async function restoreDevSettings(page: Page): Promise<void> {
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: "Configurações" }),
  ).toBeVisible();
  await page.getByLabel("Nome da empresa").clear();
  await page.getByLabel("Nome da empresa").fill(DEV_COMPANY_NAME);
  await page.getByLabel("Nome do assistente").clear();
  await page.getByLabel("Nome do assistente").fill(DEV_ASSISTANT_LABEL);
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(
    page.getByText("Configurações salvas com sucesso."),
  ).toBeVisible({ timeout: 30_000 });
}

test.describe("F5 — Settings @f5 @smoke", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await restoreDevSettings(page);
  });

  test.afterEach(async ({ page }) => {
    await restoreDevSettings(page);
  });

  test("settings persist after save", async ({ page }) => {
    const marker = `E2E Settings ${Date.now()}`;

    await page.goto("/settings");
    const companyInput = page.getByLabel("Nome da empresa");
    await companyInput.clear();
    await companyInput.fill(marker);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(
      page.getByText("Configurações salvas com sucesso."),
    ).toBeVisible({ timeout: 30_000 });

    await page.reload();
    await expect(companyInput).toHaveValue(marker);
  });

  test("assistant label persists after save", async ({ page }) => {
    const marker = `Assistente E2E ${Date.now()}`;

    await page.goto("/settings");
    const labelInput = page.getByLabel("Nome do assistente");
    await labelInput.clear();
    await labelInput.fill(marker);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(
      page.getByText("Configurações salvas com sucesso."),
    ).toBeVisible({ timeout: 30_000 });

    await page.reload();
    await expect(labelInput).toHaveValue(marker);
  });

  test("saved assistant label appears on chat page", async ({
    page,
    chatPage,
  }) => {
    const marker = `Label Chat ${Date.now()}`;

    await page.goto("/settings");
    const labelInput = page.getByLabel("Nome do assistente");
    await labelInput.clear();
    await labelInput.fill(marker);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(
      page.getByText("Configurações salvas com sucesso."),
    ).toBeVisible({ timeout: 30_000 });

    await chatPage.goto(DEV_PUBLIC_KEY);
    await expect(page.getByText(marker).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByRole("heading", { name: DEV_COMPANY_NAME }),
    ).toBeVisible();
  });
});
