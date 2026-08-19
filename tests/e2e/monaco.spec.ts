import { expect, test } from "../_shared/app-fixtures";

const SLUG = "refactor-the-payment-processor";
const STARTER_TEXT = "interface IPaymentStrategy";
const EDITOR_SELECTOR = ".monaco-editor";
const TYPED_TEXT = "// user edit";

function getEditor(page: import("@playwright/test").Page) {
  return page.locator(EDITOR_SELECTOR).first();
}

async function getMonacoValue(
  page: import("@playwright/test").Page,
): Promise<string> {
  return page.evaluate(() => {
    const monaco = (
      window as unknown as {
        monaco?: {
          editor: { getModels: () => Array<{ getValue: () => string }> };
        };
      }
    ).monaco;
    if (monaco?.editor) {
      const models = monaco.editor.getModels();
      if (models.length > 0) {
        return models[0].getValue();
      }
    }
    return "";
  });
}

async function clearAndType(
  page: import("@playwright/test").Page,
  text: string,
) {
  const textarea = page.locator(".monaco-editor textarea").first();
  await textarea.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Delete");
  await textarea.fill(text);
}

test("Monaco editor renders the challenge starter code", async ({
  authenticatedPage: page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();
  const value = await getMonacoValue(page);
  expect(value).toContain(STARTER_TEXT);
});

test.skip("user can type and modify code in the Monaco editor", async ({
  authenticatedPage: page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();

  await clearAndType(page, TYPED_TEXT);

  const value = await getMonacoValue(page);
  expect(value).toContain(TYPED_TEXT);
});

test.skip("reset button restores the original starter code", async ({
  authenticatedPage: page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();

  await clearAndType(page, "// changed");
  let value = await getMonacoValue(page);
  expect(value).toContain("// changed");

  const resetButton = page.getByRole("button", { name: "Reset Code" });
  await resetButton.click();

  value = await getMonacoValue(page);
  expect(value).toContain(STARTER_TEXT);
  expect(value).not.toContain("// changed");
});

test("submit button is available to capture editor content", async ({
  authenticatedPage: page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const submitButton = page.getByRole("button", {
    name: "Submit for Review",
  });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
});

test("problem page does not crash from Monaco SSR errors", async ({
  authenticatedPage: page,
}) => {
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
