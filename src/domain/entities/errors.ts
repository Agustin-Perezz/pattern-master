export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class ChallengeNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Challenge with slug "${slug}" was not found`, "CHALLENGE_NOT_FOUND");
    this.name = "ChallengeNotFoundError";
  }
}

export class InvalidChallengeError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_CHALLENGE");
    this.name = "InvalidChallengeError";
  }
}

export class InvalidSubmissionError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_SUBMISSION");
    this.name = "InvalidSubmissionError";
  }
}
