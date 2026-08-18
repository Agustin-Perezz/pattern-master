import { Difficulty } from "./difficulty.enum";
import { InvalidChallengeError } from "./errors";

export const CHALLENGE_SLUG_MIN_LENGTH = 1;
export const CHALLENGE_SLUG_MAX_LENGTH = 200;
export const CHALLENGE_TITLE_MAX_LENGTH = 200;
export const CHALLENGE_CATEGORY_MAX_LENGTH = 100;
export const CHALLENGE_CHALLENGE_MAX_LENGTH = 200;
export const CHALLENGE_SUMMARY_MAX_LENGTH = 500;
export const CHALLENGE_DESCRIPTION_MAX_LENGTH = 5000;
export const CHALLENGE_DESCRIPTION_CODE_MAX_LENGTH = 200;
export const CHALLENGE_FILE_NAME_MAX_LENGTH = 200;
export const CHALLENGE_CODE_MIN_LENGTH = 1;
export const CHALLENGE_CODE_MAX_LENGTH = 100000;

export type ChallengeProps = {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly difficulty: Difficulty;
  readonly summary: string;
  readonly challenge: string;
  readonly description: string;
  readonly descriptionCode?: string;
  readonly starterFile: string;
  readonly starterCode: string;
  readonly editorFile: string;
  readonly editorCode: string;
};

export type ChallengeInput = {
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  challenge: string;
  description: string;
  descriptionCode?: string;
  starterFile: string;
  starterCode: string;
  editorFile: string;
  editorCode: string;
};

export class Challenge {
  private constructor(private readonly props: ChallengeProps) {}

  static create(input: ChallengeInput): Challenge {
    if (
      input.slug.length < CHALLENGE_SLUG_MIN_LENGTH ||
      input.slug.length > CHALLENGE_SLUG_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Slug must be between ${CHALLENGE_SLUG_MIN_LENGTH} and ${CHALLENGE_SLUG_MAX_LENGTH} characters`,
      );
    }

    if (
      input.title.length === 0 ||
      input.title.length > CHALLENGE_TITLE_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Title must be between 1 and ${CHALLENGE_TITLE_MAX_LENGTH} characters`,
      );
    }

    if (
      input.category.length === 0 ||
      input.category.length > CHALLENGE_CATEGORY_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Category must be between 1 and ${CHALLENGE_CATEGORY_MAX_LENGTH} characters`,
      );
    }

    if (!Object.values(Difficulty).includes(input.difficulty)) {
      throw new InvalidChallengeError(
        `Difficulty must be one of ${Object.values(Difficulty).join(", ")}`,
      );
    }

    if (
      input.summary.length === 0 ||
      input.summary.length > CHALLENGE_SUMMARY_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Summary must be between 1 and ${CHALLENGE_SUMMARY_MAX_LENGTH} characters`,
      );
    }

    if (
      input.challenge.length === 0 ||
      input.challenge.length > CHALLENGE_CHALLENGE_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Challenge must be between 1 and ${CHALLENGE_CHALLENGE_MAX_LENGTH} characters`,
      );
    }

    if (
      input.description.length === 0 ||
      input.description.length > CHALLENGE_DESCRIPTION_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Description must be between 1 and ${CHALLENGE_DESCRIPTION_MAX_LENGTH} characters`,
      );
    }

    if (
      input.descriptionCode !== undefined &&
      input.descriptionCode.length > CHALLENGE_DESCRIPTION_CODE_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Description code must be at most ${CHALLENGE_DESCRIPTION_CODE_MAX_LENGTH} characters`,
      );
    }

    if (
      input.starterFile.length === 0 ||
      input.starterFile.length > CHALLENGE_FILE_NAME_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Starter file must be between 1 and ${CHALLENGE_FILE_NAME_MAX_LENGTH} characters`,
      );
    }

    if (
      input.starterCode.length < CHALLENGE_CODE_MIN_LENGTH ||
      input.starterCode.length > CHALLENGE_CODE_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Starter code must be between ${CHALLENGE_CODE_MIN_LENGTH} and ${CHALLENGE_CODE_MAX_LENGTH} characters`,
      );
    }

    if (
      input.editorFile.length === 0 ||
      input.editorFile.length > CHALLENGE_FILE_NAME_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Editor file must be between 1 and ${CHALLENGE_FILE_NAME_MAX_LENGTH} characters`,
      );
    }

    if (
      input.editorCode.length < CHALLENGE_CODE_MIN_LENGTH ||
      input.editorCode.length > CHALLENGE_CODE_MAX_LENGTH
    ) {
      throw new InvalidChallengeError(
        `Editor code must be between ${CHALLENGE_CODE_MIN_LENGTH} and ${CHALLENGE_CODE_MAX_LENGTH} characters`,
      );
    }

    return new Challenge({
      slug: input.slug,
      title: input.title,
      category: input.category,
      difficulty: input.difficulty,
      summary: input.summary,
      challenge: input.challenge,
      description: input.description,
      descriptionCode: input.descriptionCode,
      starterFile: input.starterFile,
      starterCode: input.starterCode,
      editorFile: input.editorFile,
      editorCode: input.editorCode,
    });
  }

  get slug(): string {
    return this.props.slug;
  }

  get title(): string {
    return this.props.title;
  }

  get category(): string {
    return this.props.category;
  }

  get difficulty(): Difficulty {
    return this.props.difficulty;
  }

  get summary(): string {
    return this.props.summary;
  }

  get challenge(): string {
    return this.props.challenge;
  }

  get description(): string {
    return this.props.description;
  }

  get descriptionCode(): string | undefined {
    return this.props.descriptionCode;
  }

  get starterFile(): string {
    return this.props.starterFile;
  }

  get starterCode(): string {
    return this.props.starterCode;
  }

  get editorFile(): string {
    return this.props.editorFile;
  }

  get editorCode(): string {
    return this.props.editorCode;
  }

  toObject(): ChallengeProps {
    return { ...this.props };
  }
}
