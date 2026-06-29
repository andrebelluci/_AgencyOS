import type { Page } from "@playwright/test";

import { DEV_OWNER_EMAIL, DEV_OWNER_PASSWORD } from "../constants";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(next = "/dashboard") {
    await this.page.goto(`/login?next=${encodeURIComponent(next)}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
  }

  async login(
    email = DEV_OWNER_EMAIL,
    password = DEV_OWNER_PASSWORD,
  ) {
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
    await Promise.all([
      this.page.waitForURL("**/dashboard", { timeout: 90_000 }),
      this.page.getByRole("button", { name: "Entrar" }).click(),
    ]);
  }
}
