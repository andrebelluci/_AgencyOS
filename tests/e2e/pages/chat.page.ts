import type { Page } from "@playwright/test";

import { DEV_ASSISTANT_LABEL, DEV_COMPANY_NAME } from "../constants";

export class ChatPage {
  constructor(private readonly page: Page) {}

  async goto(publicKey: string) {
    await this.page.goto(`/chat?key=${encodeURIComponent(publicKey)}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
  }

  async expectLoaded() {
    await this.page
      .getByRole("heading", { name: DEV_COMPANY_NAME })
      .waitFor();
    await this.page.getByText(DEV_ASSISTANT_LABEL).first().waitFor();
    await this.page.getByLabel("Mensagem").waitFor();
  }

  messageInput() {
    return this.page.getByLabel("Mensagem");
  }

  sendButton() {
    return this.page.getByRole("button", { name: "Enviar mensagem" });
  }

  async sendMessage(text: string) {
    await this.messageInput().fill(text);
    await this.sendButton().click();
  }

  userMessages() {
    return this.page.locator('[aria-live="polite"] .justify-end p');
  }

  assistantMessages() {
    return this.page.locator('[aria-live="polite"] .justify-start p');
  }

  whatsappCta() {
    return this.page.getByTestId("whatsapp-cta");
  }
}
