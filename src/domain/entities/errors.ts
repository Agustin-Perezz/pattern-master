export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book with id "${bookId}" was not found`, "BOOK_NOT_FOUND");
    this.name = "BookNotFoundError";
  }
}

export class InvalidBookError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_BOOK");
    this.name = "InvalidBookError";
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
