import type { SupabaseClient } from "@supabase/supabase-js";
import { CreateSubmissionUseCase } from "@/application/use-cases/create-submission/create-submission.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseCreateSubmissionRepository } from "@/infrastructure/database/postgres/repositories/submissions/supabase-create-submission.repository";

export type SubmissionContainer = {
  create: CreateSubmissionUseCase;
};

export function createSubmissionContainer(
  supabase: SupabaseClient<Database>,
): SubmissionContainer {
  const createRepository = new SupabaseCreateSubmissionRepository(supabase);

  return {
    create: new CreateSubmissionUseCase(createRepository),
  };
}
