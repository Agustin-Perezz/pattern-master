import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateSubmissionRepository } from "@/application/use-cases/create-submission/create-submission.repository.interface";
import type { Submission } from "@/domain/entities/submission.entity";
import type { Database } from "../../database.types";
import { submissionMapper } from "../../mappers/submission.mapper";

export class SupabaseCreateSubmissionRepository
  implements CreateSubmissionRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(submission: Submission): Promise<Submission> {
    const payload = submissionMapper.toPersistence(submission);
    const { data, error } = await this.supabase
      .from("submissions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create submission: ${error.message}`);
    }

    return submissionMapper.toDomain(data);
  }
}
