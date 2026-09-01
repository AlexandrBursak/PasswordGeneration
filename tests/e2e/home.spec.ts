import { expect, test } from "@playwright/test";

test("loads the scaffolded home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "passGeneration" })).toBeVisible();
});
