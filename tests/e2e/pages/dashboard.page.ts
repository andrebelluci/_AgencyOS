import type { Page } from "@playwright/test";

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/dashboard");
  }

  async expectLoaded() {
    await this.page.getByRole("heading", { name: "Dashboard" }).waitFor();
    await this.page.getByText("Total de conversas").waitFor();
    await this.page.getByText("Total de leads").waitFor();
  }
}
