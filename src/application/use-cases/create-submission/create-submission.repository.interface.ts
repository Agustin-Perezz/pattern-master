import type { Submission } from "@/domain/entities/submission.entity";

export interface CreateSubmissionRepository {
  create(submission: Submission): Promise<Submission>;
}
