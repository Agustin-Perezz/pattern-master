import type { Database } from "../database.types";

export type SubmissionRow = Database["public"]["Tables"]["submissions"]["Row"];
export type SubmissionInsert =
  Database["public"]["Tables"]["submissions"]["Insert"];
export type SubmissionUpdate =
  Database["public"]["Tables"]["submissions"]["Update"];
