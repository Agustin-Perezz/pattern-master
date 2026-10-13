import { describe, expect, it } from "vitest";
import { DEFAULT_PROMPT_VERSION_ID } from "@/infrastructure/ai/openai/prompts/evaluator-prompts";

// `provider.ts` imports the production evaluator, whose module chain validates
// the Supabase env vars at load time (see `src/lib/shared/infrastructure/env.ts`).
// Provide inert values before the dynamic import so this suite stays hermetic:
// no network, no real credentials. The import must stay dynamic because ESM
// static imports hoist above these assignments.
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";

const {
  CHALLENGE_SLUG_VAR,
  CODE_VAR,
  TARGET_PATTERN_VAR,
  readStringVar,
  requireNonEmptyVar,
  resolvePromptVersionId,
} = await import("./provider");

const CHALLENGE_SLUG = "refactor-the-payment-processor";
const TARGET_PATTERN = "The Strategy Pattern";

describe("readStringVar (code)", () => {
  it("accepts an empty string so `edge-empty` cases reach the evaluator", () => {
    expect(readStringVar({ [CODE_VAR]: "" }, CODE_VAR)).toBe("");
  });

  it("accepts a non-empty string unchanged", () => {
    expect(readStringVar({ [CODE_VAR]: "const x = 1;" }, CODE_VAR)).toBe(
      "const x = 1;",
    );
  });

  it("rejects a missing var", () => {
    expect(() => readStringVar({}, CODE_VAR)).toThrow();
  });

  it("rejects a non-string value", () => {
    expect(() => readStringVar({ [CODE_VAR]: 42 }, CODE_VAR)).toThrow();
  });
});

describe("requireNonEmptyVar (challengeSlug / targetPattern)", () => {
  it("accepts non-empty strings", () => {
    expect(
      requireNonEmptyVar(
        { [CHALLENGE_SLUG_VAR]: CHALLENGE_SLUG },
        CHALLENGE_SLUG_VAR,
      ),
    ).toBe(CHALLENGE_SLUG);
    expect(
      requireNonEmptyVar(
        { [TARGET_PATTERN_VAR]: TARGET_PATTERN },
        TARGET_PATTERN_VAR,
      ),
    ).toBe(TARGET_PATTERN);
  });

  it("rejects an empty string", () => {
    expect(() =>
      requireNonEmptyVar({ [CHALLENGE_SLUG_VAR]: "" }, CHALLENGE_SLUG_VAR),
    ).toThrow();
  });

  it("rejects a missing var", () => {
    expect(() => requireNonEmptyVar({}, TARGET_PATTERN_VAR)).toThrow();
  });

  it("rejects a non-string value", () => {
    expect(() =>
      requireNonEmptyVar({ [TARGET_PATTERN_VAR]: 0 }, TARGET_PATTERN_VAR),
    ).toThrow();
  });
});

describe("resolvePromptVersionId", () => {
  it("uses a trimmed non-empty prompt as the version id", () => {
    expect(resolvePromptVersionId("v2")).toBe("v2");
    expect(resolvePromptVersionId("  v1  ")).toBe("v1");
  });

  it("falls back to the default version for an empty prompt", () => {
    expect(resolvePromptVersionId("")).toBe(DEFAULT_PROMPT_VERSION_ID);
    expect(resolvePromptVersionId("   ")).toBe(DEFAULT_PROMPT_VERSION_ID);
  });
});
