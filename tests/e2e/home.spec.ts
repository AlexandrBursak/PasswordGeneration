import { expect, test } from "@playwright/test";

test("loads the scaffolded home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "passGeneration" })).toBeVisible();
});

test("shows navigation between RexSoft services", async ({ page }) => {
  await page.goto("/");

  const passwordGeneratorLink = page.getByRole("link", { name: "Password Generator" });
  const markdownConverterLink = page.getByRole("link", { name: "Markdown to HTML" });

  await expect(passwordGeneratorLink).toHaveAttribute("aria-current", "page");
  await expect(passwordGeneratorLink).toHaveAttribute("href", "https://passgen.rexsoftproduction.com/");
  await expect(markdownConverterLink).toHaveAttribute("href", "https://markdown-convertor.rexsoftproduction.com/");
});

test("updates the password length with the slider", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("slider").press("ArrowRight");

  await expect(page.getByRole("spinbutton", { name: "Password length" })).toHaveValue("17");
});
