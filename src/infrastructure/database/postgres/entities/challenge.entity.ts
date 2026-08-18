import type { Database } from "../database.types";

export type ChallengeRow = Database["public"]["Tables"]["challenges"]["Row"];
export type ChallengeInsert =
  Database["public"]["Tables"]["challenges"]["Insert"];
export type ChallengeUpdate =
  Database["public"]["Tables"]["challenges"]["Update"];
