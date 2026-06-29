import { DEV_PUBLIC_KEY } from "./constants";
import { expect, skipWithoutOpenAi, test } from "./fixtures";

test.describe("F3 — Knowledge @f3 @smoke @openai", () => {
  const faqQuestion = `Qual o prazo de garantia E2E ${Date.now()}?`;
  const faqAnswer =
    "Nossa garantia cobre 12 meses para serviços de acabamento aplicados pela Belluci.";

  test.beforeEach(() => {
    skipWithoutOpenAi();
  });

  test("FAQ answer is reflected in chat response", async ({
    chatPage,
    page,
  }) => {
    await page.goto("/knowledge");
    await expect(page.getByRole("heading", { name: "Conhecimento" })).toBeVisible();

    await page.getByLabel("Pergunta").fill(faqQuestion);
    await page.getByLabel("Resposta").fill(faqAnswer);
    await page.getByRole("button", { name: "Adicionar" }).click();
    await expect(page.getByText(faqQuestion)).toBeVisible({ timeout: 15_000 });

    await chatPage.goto(DEV_PUBLIC_KEY);
    await chatPage.expectLoaded();
    await chatPage.sendMessage(faqQuestion);
    await expect(chatPage.sendButton()).toBeEnabled({ timeout: 60_000 });

    const lastAssistant = chatPage.assistantMessages().last();
    await expect(lastAssistant).toContainText(/12 meses|garantia/i, {
      timeout: 10_000,
    });
  });
});
