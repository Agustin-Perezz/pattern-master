import { z } from "zod";

export const GET_CHALLENGE_BY_SLUG_SLUG_MIN = 1;

export const getChallengeBySlugRequestDto = z.object({
  slug: z.string().min(GET_CHALLENGE_BY_SLUG_SLUG_MIN),
});

export type GetChallengeBySlugRequestDto = z.infer<
  typeof getChallengeBySlugRequestDto
>;
