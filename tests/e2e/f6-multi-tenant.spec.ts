import { DEV_PUBLIC_KEY, INVALID_PUBLIC_KEY } from "./constants";
import { expect, test } from "./fixtures";

const REJECTED_API_STATUSES = [400, 403, 404, 429, 503] as const;

test.describe("F6 — Multi-tenant @f6 @smoke", () => {
  test("invalid public key returns 404 on chat", async ({ page }) => {
    const response = await page.goto(
      `/chat?key=${encodeURIComponent(INVALID_PUBLIC_KEY)}`,
    );
    expect(response?.status()).toBe(404);
  });

  test("chat API rejects unknown public key", async ({ request }) => {
    const response = await request.post("/api/chat", {
      data: {
        public_key: INVALID_PUBLIC_KEY,
        message: "teste",
        visitor_id: "e2e-visitor",
      },
    });

    expect(REJECTED_API_STATUSES).toContain(response.status());
    expect(response.ok()).toBeFalsy();
  });

  test("widget config resolves only for valid tenant key", async ({
    request,
  }) => {
    const valid = await request.get(
      `/api/widget/config?key=${encodeURIComponent(DEV_PUBLIC_KEY)}`,
    );
    expect(valid.ok()).toBeTruthy();

    const validBody = (await valid.json()) as {
      assistant_label?: string;
      company_name?: string;
    };
    expect(validBody.assistant_label).toBeTruthy();
    expect(validBody.company_name).toBeTruthy();

    const invalid = await request.get(
      `/api/widget/config?key=${encodeURIComponent(INVALID_PUBLIC_KEY)}`,
    );
    expect(invalid.status()).toBe(404);
  });

  test("authenticated leads page does not expose invalid tenant data", async ({
    page,
  }) => {
    await page.goto("/leads");
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();

    const table = page.locator("table");
    if (await table.isVisible()) {
      await expect(table).not.toContainText(INVALID_PUBLIC_KEY);
    }
  });
});
