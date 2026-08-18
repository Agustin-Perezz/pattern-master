import { InvalidSubmissionError } from "./errors";

export const SUBMISSION_SCORE_MIN = 0;
export const SUBMISSION_SCORE_MAX = 100;
export const SUBMISSION_SUBMITTED_CODE_MIN_LENGTH = 1;

export type SubmissionFeedback = Record<string, unknown>;

export type SubmissionProps = {
  readonly id: string;
  readonly userId: string;
  readonly challengeSlug: string;
  readonly submittedCode: string;
  readonly score: number;
  readonly patternApplied: boolean;
  readonly feedback: SubmissionFeedback;
  readonly createdAt: string;
};

export type SubmissionInput = {
  id?: string;
  userId: string;
  challengeSlug: string;
  submittedCode: string;
  score: number;
  patternApplied: boolean;
  feedback: SubmissionFeedback;
  createdAt?: string;
};

export class Submission {
  private constructor(private readonly props: SubmissionProps) {}

  static create(input: SubmissionInput): Submission {
    if (input.submittedCode.length < SUBMISSION_SUBMITTED_CODE_MIN_LENGTH) {
      throw new InvalidSubmissionError(
        `Submitted code must be at least ${SUBMISSION_SUBMITTED_CODE_MIN_LENGTH} character`,
      );
    }

    if (
      input.score < SUBMISSION_SCORE_MIN ||
      input.score > SUBMISSION_SCORE_MAX
    ) {
      throw new InvalidSubmissionError(
        `Score must be between ${SUBMISSION_SCORE_MIN} and ${SUBMISSION_SCORE_MAX}`,
      );
    }

    return new Submission({
      id: input.id ?? crypto.randomUUID(),
      userId: input.userId,
      challengeSlug: input.challengeSlug,
      submittedCode: input.submittedCode,
      score: input.score,
      patternApplied: input.patternApplied,
      feedback: input.feedback,
      createdAt: input.createdAt ?? new Date().toISOString(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get challengeSlug(): string {
    return this.props.challengeSlug;
  }

  get submittedCode(): string {
    return this.props.submittedCode;
  }

  get score(): number {
    return this.props.score;
  }

  get patternApplied(): boolean {
    return this.props.patternApplied;
  }

  get feedback(): SubmissionFeedback {
    return this.props.feedback;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toObject(): SubmissionProps {
    return { ...this.props };
  }
}
