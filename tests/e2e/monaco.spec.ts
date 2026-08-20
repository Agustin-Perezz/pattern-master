import { expect, test } from "../_shared/app-fixtures";

const SLUG = "refactor-the-payment-processor";
const STARTER_TEXT = "class Checkout";
const EDITOR_SELECTOR = ".monaco-editor";

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

test("Monaco editor renders the challenge starter code", async ({
  authenticatedPage: page,
}) => {
  await page.goto(`/problems/${SLUG}`);

  const editor = getEditor(page);
  await expect(editor).toBeVisible();
  const value = await getMonacoValue(page);
  expect(value).toContain(STARTER_TEXT);
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
