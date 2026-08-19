import { describe, expect, it, vi } from "vitest";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import type { EvaluateSubmissionRepository } from "./evaluate-submission.repository.interface";
import { EvaluateSubmissionUseCase } from "./evaluate-submission.use-case";

const VALID_REQUEST = {
  code: "class Checkout { process() {} }",
  challengeSlug: "refactor-the-payment-processor",
  targetPattern: "Strategy",
};

function makeEvaluation(overrides: Partial<Evaluation> = {}): Evaluation {
  return {
    score: 75,
    patternApplied: true,
    praise: "Good abstraction",
    criticalFeedback: "Missing interface",
    cleanArchitectureViolations: ["SRP violation"],
    ...overrides,
  };
}

describe("EvaluateSubmissionUseCase", () => {
  it("returns the evaluation from the repository", async () => {
    const evaluation = makeEvaluation();
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn().mockResolvedValue(evaluation),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    const result = await useCase.execute(VALID_REQUEST);

    expect(repository.evaluate).toHaveBeenCalledWith(
      VALID_REQUEST.code,
      VALID_REQUEST.challengeSlug,
      VALID_REQUEST.targetPattern,
    );
    expect(result).toEqual({ evaluation });
  });

  it("throws when code is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, code: "" }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("throws when challengeSlug is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, challengeSlug: "" }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("throws when targetPattern is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, targetPattern: "" }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("passes through repository errors", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn().mockRejectedValue(new Error("AI provider unavailable")),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(useCase.execute(VALID_REQUEST)).rejects.toThrow(
      "AI provider unavailable",
    );
  });
});
