import { describe, expect, it, vi } from "vitest";
import { Submission } from "@/domain/entities/submission.entity";
import type { CreateSubmissionRepository } from "./create-submission.repository.interface";
import { CreateSubmissionUseCase } from "./create-submission.use-case";

const VALID_REQUEST = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  challengeSlug: "refactor-the-payment-processor",
  submittedCode: "class Checkout { process() {} }",
  score: 75,
  patternApplied: true,
  feedback: {
    praise: "Good abstraction",
    criticalFeedback: "Missing interface",
    cleanArchitectureViolations: ["SRP violation"],
  },
};

describe("CreateSubmissionUseCase", () => {
  it("creates and persists a submission", async () => {
    const savedSubmission = Submission.create(VALID_REQUEST);
    const repository: CreateSubmissionRepository = {
      create: vi.fn().mockResolvedValue(savedSubmission),
    };
    const useCase = new CreateSubmissionUseCase(repository);

    const result = await useCase.execute(VALID_REQUEST);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.submission).toBe(savedSubmission);
  });

  it("throws when userId is not a valid UUID", async () => {
    const repository: CreateSubmissionRepository = {
      create: vi.fn(),
    };
    const useCase = new CreateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, userId: "not-a-uuid" }),
    ).rejects.toThrow();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("throws when submittedCode is empty", async () => {
    const repository: CreateSubmissionRepository = {
      create: vi.fn(),
    };
    const useCase = new CreateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, submittedCode: "" }),
    ).rejects.toThrow();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("throws when score is out of range", async () => {
    const repository: CreateSubmissionRepository = {
      create: vi.fn(),
    };
    const useCase = new CreateSubmissionUseCase(repository);

    await expect(
      useCase.execute({ ...VALID_REQUEST, score: 101 }),
    ).rejects.toThrow();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("passes through repository errors", async () => {
    const repository: CreateSubmissionRepository = {
      create: vi.fn().mockRejectedValue(new Error("DB connection lost")),
    };
    const useCase = new CreateSubmissionUseCase(repository);

    await expect(useCase.execute(VALID_REQUEST)).rejects.toThrow(
      "DB connection lost",
    );
  });
});
