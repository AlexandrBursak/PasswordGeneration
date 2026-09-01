import { expect, test } from "@playwright/test";

test("loads the scaffolded home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "passGeneration" })).toBeVisible();
});

test("updates the password length with the slider", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("slider").press("ArrowRight");

  await expect(page.getByRole("spinbutton", { name: "Password length" })).toHaveValue("17");
});
