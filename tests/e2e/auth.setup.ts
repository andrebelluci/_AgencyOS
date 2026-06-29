import { test as setup, expect } from "@playwright/test";

import {
  DEV_OWNER_EMAIL,
  DEV_OWNER_PASSWORD,
} from "./constants";

const authFile = "playwright/.auth/owner.json";

setup("authenticate owner", async ({ page }) => {
  await page.goto("/login?next=/dashboard", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.locator("#email").fill(DEV_OWNER_EMAIL);
  await page.locator("#password").fill(DEV_OWNER_PASSWORD);

  await Promise.all([
    page.waitForURL("**/dashboard", { timeout: 90_000 }),
    page.getByRole("button", { name: "Entrar" }).click(),
  ]);

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
    timeout: 30_000,
  });

  await page.context().storageState({ path: authFile });
});
