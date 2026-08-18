import { Challenge } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";
import type {
  ChallengeInsert,
  ChallengeRow,
} from "../entities/challenge.entity";

export const challengeMapper = {
  toDomain(row: ChallengeRow): Challenge {
    return Challenge.create({
      slug: row.slug,
      title: row.title,
      category: row.category,
      difficulty: Difficulty[row.difficulty],
      summary: row.summary,
      challenge: row.challenge,
      description: row.description,
      descriptionCode: row.description_code ?? undefined,
      starterFile: row.starter_file,
      starterCode: row.starter_code,
      editorFile: row.editor_file,
      editorCode: row.editor_code,
    });
  },

  toPersistence(challenge: Challenge): ChallengeInsert {
    const props = challenge.toObject();
    return {
      slug: props.slug,
      title: props.title,
      category: props.category,
      difficulty: props.difficulty,
      summary: props.summary,
      challenge: props.challenge,
      description: props.description,
      description_code: props.descriptionCode ?? null,
      starter_file: props.starterFile,
      starter_code: props.starterCode,
      editor_file: props.editorFile,
      editor_code: props.editorCode,
    };
  },
};
