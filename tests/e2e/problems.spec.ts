import { expect, test } from "../_shared/app-fixtures";

const CHALLENGE_TITLES = [
  "Refactor the Payment Processor",
  "Tame the Notification Service",
  "Build a Widget Factory",
  "One Config to Rule Them All",
  "Wrap the Legacy API",
  "Decorate Your Coffee",
] as const;

test("problems page renders all seeded challenges from the database", async ({
  page,
}) => {
  await page.goto("/");

  for (const title of CHALLENGE_TITLES) {
    await expect(
      page.getByRole("heading", { name: title, level: 3 }),
    ).toBeVisible();
  }
});

test("problems page filters challenges by difficulty", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Decorate Your Coffee", level: 3 }),
  ).toBeVisible();

  const structuralFilter = page.getByRole("tab", { name: "Structural" });
  await structuralFilter.click();

  await expect(
    page.getByRole("heading", { name: "Decorate Your Coffee", level: 3 }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Wrap the Legacy API",
      level: 3,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Refactor the Payment Processor",
      level: 3,
    }),
  ).not.toBeVisible();
});

test("challenge detail page renders a real challenge from the database", async ({
  authenticatedPage: page,
}) => {
  await page.goto("/problems/refactor-the-payment-processor");

  await expect(
    page.getByRole("heading", {
      name: "Refactor the Payment Processor",
      level: 1,
    }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "The current Checkout class uses a massive switch statement",
    ),
  ).toBeVisible();
});

test("unknown challenge slug renders a not-found state", async ({
  authenticatedPage: page,
}) => {
  await page.goto("/problems/does-not-exist");

  await expect(
    page.getByRole("heading", { name: "404", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "This page could not be found.",
      level: 2,
    }),
  ).toBeVisible();
});
