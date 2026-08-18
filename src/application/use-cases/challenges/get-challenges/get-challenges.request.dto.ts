import { z } from "zod";

export const GET_CHALLENGES_LIMIT_MIN = 1;

export const getChallengesRequestDto = z.object({
  limit: z.number().int().min(GET_CHALLENGES_LIMIT_MIN).optional(),
});

export type GetChallengesRequestDto = z.infer<typeof getChallengesRequestDto>;
