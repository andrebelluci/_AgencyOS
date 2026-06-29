import { test as base, expect } from "@playwright/test";

import { ChatPage } from "../pages/chat.page";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";

type AgencyFixtures = {
  chatPage: ChatPage;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<AgencyFixtures>({
  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect };

export function skipWithoutOpenAi() {
  test.skip(
    !process.env.OPENAI_API_KEY?.trim(),
    "OPENAI_API_KEY required for AI-dependent E2E tests",
  );
}

/** Ignore benign dev-console noise (Next.js HMR, favicon, etc.). */
export function isBenignConsoleError(message: string): boolean {
  return (
    message.includes("favicon") ||
    message.includes("Download the React DevTools") ||
    message.includes("Hydration") ||
    message.includes("[HMR]") ||
    message.includes("Failed to load resource") && message.includes("favicon")
  );
}
