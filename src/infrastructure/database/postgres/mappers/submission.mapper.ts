import { Submission } from "@/domain/entities/submission.entity";
import type {
  SubmissionInsert,
  SubmissionRow,
} from "../entities/submission.entity";

export const submissionMapper = {
  toDomain(row: SubmissionRow): Submission {
    return Submission.create({
      id: row.id,
      userId: row.user_id,
      challengeSlug: row.challenge_slug,
      submittedCode: row.submitted_code,
      score: row.score,
      patternApplied: row.pattern_applied,
      feedback: row.feedback_json as Record<string, unknown>,
      createdAt: row.created_at,
    });
  },
  toPersistence(submission: Submission): SubmissionInsert {
    const props = submission.toObject();
    return {
      id: props.id,
      user_id: props.userId,
      challenge_slug: props.challengeSlug,
      submitted_code: props.submittedCode,
      score: props.score,
      pattern_applied: props.patternApplied,
      feedback_json: props.feedback as SubmissionInsert["feedback_json"],
    };
  },
};
