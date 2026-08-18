import { expect, test } from "../_shared/app-fixtures";
import { supabaseTestClient } from "../_shared/fixtures/supabase-test-client";

const EXPECTED_CHALLENGE_COUNT = 6;
const VALID_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

test("seeded challenges are present in the database after reset", async () => {
  const { data: challenges, error } = await supabaseTestClient
    .from("challenges")
    .select("*");

  expect(error).toBeNull();
  expect(challenges).toHaveLength(EXPECTED_CHALLENGE_COUNT);

  for (const challenge of challenges ?? []) {
    expect(challenge.slug).toBeTruthy();
    expect(challenge.title).toBeTruthy();
    expect(challenge.category).toBeTruthy();
    expect(VALID_DIFFICULTIES).toContain(challenge.difficulty);
    expect(challenge.summary).toBeTruthy();
    expect(challenge.challenge).toBeTruthy();
    expect(challenge.description).toBeTruthy();
    expect(challenge.starter_file).toBeTruthy();
    expect(challenge.starter_code).toBeTruthy();
    expect(challenge.editor_file).toBeTruthy();
    expect(challenge.editor_code).toBeTruthy();
  }
});
