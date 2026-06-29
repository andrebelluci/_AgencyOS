import {
  DEV_ASSISTANT_LABEL,
  DEV_COMPANY_NAME,
  DEV_PUBLIC_KEY,
} from "./constants";
import { expect, isBenignConsoleError, test } from "./fixtures";

test.describe("F1 — Widget + Chat @f1 @smoke", () => {
  test("chat page loads with tenant branding", async ({ chatPage, page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isBenignConsoleError(msg.text())) {
        errors.push(msg.text());
      }
    });

    await chatPage.goto(DEV_PUBLIC_KEY);
    await chatPage.expectLoaded();

    await expect(chatPage.assistantMessages().first()).toContainText(
      new RegExp(DEV_ASSISTANT_LABEL, "i"),
    );
    await expect(chatPage.assistantMessages().first()).toContainText(
      new RegExp(DEV_COMPANY_NAME, "i"),
    );
    expect(errors).toEqual([]);
  });

  test("embed demo shows launcher button", async ({ page }) => {
    await page.goto("/widget/demo.html");
    await expect(
      page.getByRole("button", { name: /Abrir chat/i }),
    ).toBeVisible();
  });

  test("embed opens chat panel in iframe", async ({ page }) => {
    await page.goto("/widget/demo.html");
    await page.getByRole("button", { name: /Abrir chat/i }).click();
    await expect(page.locator(".aos-embed-panel.aos-open")).toBeVisible();

    const frame = page.frameLocator(".aos-embed-frame");
    await expect(
      frame.getByRole("heading", { name: DEV_COMPANY_NAME }),
    ).toBeVisible({ timeout: 90_000 });
    await expect(frame.getByText(DEV_ASSISTANT_LABEL)).toBeVisible();
    await expect(frame.getByLabel("Mensagem")).toBeVisible();
  });

  test(
    "message persists after reload in same session",
    { tag: ["@openai"] },
    async ({ chatPage, page }) => {
      test.skip(
        !process.env.OPENAI_API_KEY?.trim(),
        "OPENAI_API_KEY required to create conversation history",
      );

      const uniqueMessage = `E2E persist ${Date.now()}`;
      await chatPage.goto(DEV_PUBLIC_KEY);
      await chatPage.expectLoaded();
      await chatPage.sendMessage(uniqueMessage);
      await expect(chatPage.sendButton()).toBeEnabled({ timeout: 60_000 });
      await expect(chatPage.userMessages().last()).toContainText(uniqueMessage);

      const conversationId = await page.evaluate((publicKey) => {
        return sessionStorage.getItem(`agencyos_conversation_${publicKey}`);
      }, DEV_PUBLIC_KEY);

      expect(conversationId).toBeTruthy();

      await page.reload();
      await chatPage.expectLoaded();
      await expect(chatPage.userMessages().last()).toContainText(uniqueMessage, {
        timeout: 30_000,
      });
    },
  );
});
