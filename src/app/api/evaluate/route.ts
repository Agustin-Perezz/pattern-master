import { evaluateSubmissionRequestDto } from "@/application/use-cases/evaluate-submission/evaluate-submission.request.dto";
import { createEvaluationContainer } from "@/lib/containers/evaluation.container";
import { createSubmissionContainer } from "@/lib/containers/submission.container";
import { getUserVerified } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

const INVALID_INPUT_STATUS = 400;
const UNAUTHORIZED_STATUS = 401;
const OK_STATUS = 200;
const INVALID_INPUT_ERROR = "Invalid input";
const UNAUTHORIZED_ERROR = "Unauthorized";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = evaluateSubmissionRequestDto.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: INVALID_INPUT_ERROR },
      { status: INVALID_INPUT_STATUS },
    );
  }

  const user = await getUserVerified();

  if (!user) {
    return Response.json(
      { error: UNAUTHORIZED_ERROR },
      { status: UNAUTHORIZED_STATUS },
    );
  }

  const { evaluate } = createEvaluationContainer();
  const { evaluation } = await evaluate.execute(parsed.data);

  const supabase = await createSupabaseServerClient();
  const { create } = createSubmissionContainer(supabase);
  await create.execute({
    userId: user.id,
    challengeSlug: parsed.data.challengeSlug,
    submittedCode: parsed.data.code,
    score: evaluation.score,
    patternApplied: evaluation.patternApplied,
    feedback: {
      praise: evaluation.praise,
      criticalFeedback: evaluation.criticalFeedback,
      cleanArchitectureViolations: evaluation.cleanArchitectureViolations,
    },
  });

  return Response.json(evaluation, { status: OK_STATUS });
}
