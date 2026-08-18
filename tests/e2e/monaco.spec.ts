import { expect, test } from "../_shared/app-fixtures";

const SLUG = "refactor-the-payment-processor";
const STARTER_TEXT = "interface IPaymentStrategy";
const EDITOR_SELECTOR = ".monaco-editor";

function getEditor(page: import("@playwright/test").Page) {
  return page.locator(EDITOR_SELECTOR).first();
}

test("Monaco editor renders the challenge starter code", async ({ page }) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();
  await expect(page.getByText(STARTER_TEXT)).toBeVisible();
});

test("user can type and modify code in the Monaco editor", async ({ page }) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();

  await editor.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type("// user edit");

  await expect(page.getByText("// user edit")).toBeVisible();
});

test("reset button restores the original starter code", async ({ page }) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();

  await editor.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type("// changed");
  await expect(page.getByText("// changed")).toBeVisible();

  const resetButton = page.getByRole("button", { name: "Reset Code" });
  await resetButton.click();

  await expect(page.getByText(STARTER_TEXT)).toBeVisible();
});

test("submit button is available to capture editor content", async ({
  page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const submitButton = page.getByRole("button", {
    name: "Submit for Review",
  });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
});

test("problem page does not crash from Monaco SSR errors", async ({ page }) => {
  await page.goto(`/problems/${SLUG}`);

  await expect(
    page.getByRole("heading", {
      name: "Refactor the Payment Processor",
      level: 1,
    }),
  ).toBeVisible();

  const editor = getEditor(page);
  await expect(editor).toBeVisible();
});
