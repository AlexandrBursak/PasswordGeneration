import { expect, test } from "@playwright/test";

test("loads the scaffolded home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Password Generator" })).toBeVisible();
});

test("aligns header and content in one column of at most 1200px", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/");

  const nav = (await page.getByRole("navigation", { name: "RexSoft services" }).boundingBox())!;
  const theme = (await page.getByRole("group", { name: "Theme" }).boundingBox())!;
  const tool = (await page.getByRole("region", { name: "Generator" }).boundingBox())!;

  expect(tool.width).toBeLessThanOrEqual(1200);
  expect(tool.width).toBeGreaterThan(1100);
  expect(Math.abs(nav.x - tool.x)).toBeLessThan(2);
  expect(Math.abs(theme.x + theme.width - (tool.x + tool.width))).toBeLessThan(2);
});

test("switches between light and dark and remembers the choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  const darkBackground = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);

  await page.getByRole("radio", { name: "Light" }).check();
  await expect(html).toHaveAttribute("data-theme", "light");
  const lightBackground = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(lightBackground).not.toBe(darkBackground);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
});

test("shows navigation between RexSoft services", async ({ page }) => {
  await page.goto("/");

  const passwordGeneratorLink = page.getByRole("link", { name: "Password Generator" });
  const markdownConverterLink = page.getByRole("link", { name: "Markdown to HTML" });
  const snapLinkLink = page.getByRole("link", { name: "Snap Link" });

  await expect(passwordGeneratorLink).toHaveAttribute("aria-current", "page");
  await expect(passwordGeneratorLink).toHaveAttribute("href", "https://passgen.rexsoftproduction.com/");
  await expect(markdownConverterLink).toHaveAttribute("href", "https://markdown-convertor.rexsoftproduction.com/");
  await expect(snapLinkLink).toHaveAttribute("href", "https://snap-link.rexsoftproduction.com/");
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
