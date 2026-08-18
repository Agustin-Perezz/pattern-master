import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { createChallengeContainer } from "./challenge.container";

const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
} as unknown as SupabaseClient<Database>;

describe("challenge.container", () => {
  it("wires list and detail use cases", () => {
    const container = createChallengeContainer(mockSupabase);

    expect(container.list).toBeDefined();
    expect(container.detail).toBeDefined();
  });

  it("executes list and detail independently", async () => {
    const listSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [
              {
                slug: "singleton-pattern",
                title: "Singleton Pattern",
                category: "Creational",
                difficulty: "Easy",
                summary: "Ensure a class has only one instance.",
                challenge:
                  "Implement a Singleton that lazy-loads its unique instance.",
                description:
                  "Create a thread-safe Singleton with a private constructor.",
                description_code: "export class Singleton {}",
                starter_file: "index.ts",
                starter_code: "export class Singleton {}",
                editor_file: "index.ts",
                editor_code: "export class Singleton {}",
                created_at: "2026-01-01T00:00:00.000Z",
              },
            ],
            error: null,
          }),
        }),
      }),
    } as unknown as SupabaseClient<Database>;

    const detailSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                slug: "singleton-pattern",
                title: "Singleton Pattern",
                category: "Creational",
                difficulty: "Easy",
                summary: "Ensure a class has only one instance.",
                challenge:
                  "Implement a Singleton that lazy-loads its unique instance.",
                description:
                  "Create a thread-safe Singleton with a private constructor.",
                description_code: "export class Singleton {}",
                starter_file: "index.ts",
                starter_code: "export class Singleton {}",
                editor_file: "index.ts",
                editor_code: "export class Singleton {}",
                created_at: "2026-01-01T00:00:00.000Z",
              },
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient<Database>;

    const listContainer = createChallengeContainer(listSupabase);
    const detailContainer = createChallengeContainer(detailSupabase);

    const listResult = await listContainer.list.execute();
    const detailResult = await detailContainer.detail.execute({
      slug: "singleton-pattern",
    });

    expect(listResult.challenges).toHaveLength(1);
    expect(detailResult.challenge.slug).toBe("singleton-pattern");
  });
});
