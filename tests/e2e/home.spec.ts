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

test("generates single and batch UUIDs", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "UUID" }).click();

  await page.getByRole("button", { name: "Generate UUID", exact: true }).click();
  await expect(page.getByRole("status", { name: "Generated UUIDs" })).toHaveText(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );

  await page.getByRole("radio", { name: "UUID v7" }).check();
  await page.getByRole("radio", { name: "Batch" }).check();
  await page.getByRole("spinbutton", { name: "UUID quantity" }).fill("3");
  await page.getByRole("button", { name: "Generate UUIDs" }).click();

  const generatedUUIDs = (await page.getByRole("status", { name: "Generated UUIDs" }).textContent())?.split("\n") ?? [];
  expect(generatedUUIDs).toHaveLength(3);
  expect(generatedUUIDs.every((uuid) => /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid))).toBe(true);
});
