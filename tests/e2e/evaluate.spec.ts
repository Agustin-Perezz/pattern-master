import { expect, test } from "../_shared/app-fixtures";

const EVALUATE_URL = "/api/evaluate";
const VALID_PAYLOAD = {
  code: "class Checkout { process() {} }",
  challengeSlug: "refactor-the-payment-processor",
  targetPattern: "Strategy",
};
const EMPTY_PAYLOAD = {
  code: "",
  challengeSlug: "refactor-the-payment-processor",
  targetPattern: "Strategy",
};
const UNAUTHORIZED_STATUS = 401;
const BAD_REQUEST_STATUS = 400;

test("rejects evaluation request without authentication", async ({
  request,
}) => {
  const res = await request.post(EVALUATE_URL, { data: VALID_PAYLOAD });

  expect(res.status()).toBe(UNAUTHORIZED_STATUS);
});

test("rejects evaluation request with empty code", async ({
  authenticatedPage,
}) => {
  const res = await authenticatedPage.request.post(EVALUATE_URL, {
    data: EMPTY_PAYLOAD,
  });

  expect(res.status()).toBe(BAD_REQUEST_STATUS);
});

test.skip("returns an evaluation for valid authenticated submission", async ({
  authenticatedPage,
}) => {
  const res = await authenticatedPage.request.post(EVALUATE_URL, {
    data: VALID_PAYLOAD,
  });

  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(typeof body.score).toBe("number");
  expect(typeof body.patternApplied).toBe("boolean");
});
