import { describe, expect, it, vi } from "vitest";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import type { EvaluateSubmissionRepository } from "./evaluate-submission.repository.interface";
import { EvaluateSubmissionUseCase } from "./evaluate-submission.use-case";

function makeEvaluation(overrides: Partial<Evaluation> = {}): Evaluation {
  return {
    score: overrides.score ?? 85,
    patternApplied: overrides.patternApplied ?? true,
    praise: overrides.praise ?? "Great use of dependency inversion.",
    criticalFeedback:
      overrides.criticalFeedback ?? "Extract the builder logic.",
    cleanArchitectureViolations: overrides.cleanArchitectureViolations ?? [
      "Controller talks directly to the database.",
    ],
  };
}

const EVALUATE_SUBMISSION_VALID_CODE = "class Singleton { /* ... */ }";
const EVALUATE_SUBMISSION_VALID_SLUG = "singleton-pattern";
const EVALUATE_SUBMISSION_VALID_PATTERN = "Singleton";

describe("EvaluateSubmissionUseCase", () => {
  it("returns the evaluation provided by the repository", async () => {
    const evaluation = makeEvaluation();
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn().mockResolvedValue(evaluation),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    const result = await useCase.execute({
      code: EVALUATE_SUBMISSION_VALID_CODE,
      challengeSlug: EVALUATE_SUBMISSION_VALID_SLUG,
      targetPattern: EVALUATE_SUBMISSION_VALID_PATTERN,
    });

    expect(repository.evaluate).toHaveBeenCalledWith(
      EVALUATE_SUBMISSION_VALID_CODE,
      EVALUATE_SUBMISSION_VALID_SLUG,
      EVALUATE_SUBMISSION_VALID_PATTERN,
    );
    expect(repository.evaluate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ evaluation });
  });

  it("throws when code is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({
        code: "",
        challengeSlug: EVALUATE_SUBMISSION_VALID_SLUG,
        targetPattern: EVALUATE_SUBMISSION_VALID_PATTERN,
      }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("throws when challengeSlug is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({
        code: EVALUATE_SUBMISSION_VALID_CODE,
        challengeSlug: "",
        targetPattern: EVALUATE_SUBMISSION_VALID_PATTERN,
      }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("throws when targetPattern is empty", async () => {
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn(),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    await expect(
      useCase.execute({
        code: EVALUATE_SUBMISSION_VALID_CODE,
        challengeSlug: EVALUATE_SUBMISSION_VALID_SLUG,
        targetPattern: "",
      }),
    ).rejects.toThrow();
    expect(repository.evaluate).not.toHaveBeenCalled();
  });

  it("passes a low-score evaluation through unchanged", async () => {
    const evaluation = makeEvaluation({
      score: 12,
      patternApplied: false,
      praise: null,
      criticalFeedback: "Pattern not identified.",
      cleanArchitectureViolations: ["Mixing UI and domain logic."],
    });
    const repository: EvaluateSubmissionRepository = {
      evaluate: vi.fn().mockResolvedValue(evaluation),
    };
    const useCase = new EvaluateSubmissionUseCase(repository);

    const result = await useCase.execute({
      code: EVALUATE_SUBMISSION_VALID_CODE,
      challengeSlug: EVALUATE_SUBMISSION_VALID_SLUG,
      targetPattern: EVALUATE_SUBMISSION_VALID_PATTERN,
    });

    expect(result).toEqual({ evaluation });
  });
});
