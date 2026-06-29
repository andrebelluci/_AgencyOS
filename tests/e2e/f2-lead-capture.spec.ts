import { DEV_PUBLIC_KEY } from "./constants";
import { expect, skipWithoutOpenAi, test } from "./fixtures";

test.describe("F2 — Lead capture @f2 @smoke @openai", () => {
  test.beforeEach(() => {
    skipWithoutOpenAi();
  });

  test("qualified lead appears in dashboard leads table", async ({
    chatPage,
    page,
  }) => {
    const leadName = `Lead E2E ${Date.now()}`;
    const leadPhone = "19987654321";

    await chatPage.goto(DEV_PUBLIC_KEY);
    await chatPage.expectLoaded();
    await chatPage.sendMessage(
      `Olá, meu nome é ${leadName} e meu telefone é ${leadPhone}. Quero um orçamento de acabamento.`,
    );
    await expect(chatPage.sendButton()).toBeEnabled({ timeout: 90_000 });

    await page.goto("/leads");
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
    await expect(page.getByText(leadName)).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(new RegExp(leadPhone.slice(-8)))).toBeVisible();
  });
});
