import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/opencode/badge";
import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";

type ProblemCardProps = {
  problem: ChallengeProps;
};

function difficultyVariant(
  difficulty: Difficulty,
): "success" | "warning" | "danger" {
  if (difficulty === Difficulty.Easy) {
    return "success";
  }

  if (difficulty === Difficulty.Medium) {
    return "warning";
  }

  return "danger";
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="group flex flex-col gap-[12px] rounded-sm border border-hairline bg-surface-soft p-[20px] transition-colors hover:border-hairline-strong hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <Badge variant="label">{problem.category}</Badge>
          <Badge variant={difficultyVariant(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
        </div>
        <ArrowRight
          className="size-[16px] text-mute transition-transform group-hover:translate-x-[2px] group-hover:text-accent"
          aria-hidden
        />
      </div>
      <h3 className="font-mono text-[18px] font-bold leading-[1.3] text-ink">
        {problem.title}
      </h3>
      <p className="font-mono text-[14px] leading-[1.6] text-mute">
        {problem.summary}
      </p>
      <span className="mt-[4px] font-mono text-[13px] text-stone">
        {"&gt;"} {problem.challenge}
      </span>
    </Link>
  );
}
