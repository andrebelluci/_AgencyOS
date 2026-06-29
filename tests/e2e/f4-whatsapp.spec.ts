import { DEV_PUBLIC_KEY } from "./constants";
import { expect, skipWithoutOpenAi, test } from "./fixtures";

test.describe("F4 — WhatsApp @f4 @smoke @openai", () => {
  test.beforeEach(() => {
    skipWithoutOpenAi();
  });

  test("wa.me link includes prefilled message", async ({ chatPage }) => {
    await chatPage.goto(DEV_PUBLIC_KEY);
    await chatPage.expectLoaded();
    await chatPage.sendMessage(
      "Quero falar com um consultor no WhatsApp. Meu nome é Teste E2E e telefone 19999998888.",
    );
    await expect(chatPage.sendButton()).toBeEnabled({ timeout: 90_000 });

    const cta = chatPage.whatsappCta();
    await expect(cta).toBeVisible({ timeout: 45_000 });

    const href = await cta.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+/);
    expect(href).toMatch(/text=/);
  });
});
