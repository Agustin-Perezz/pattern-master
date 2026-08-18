import type { ChallengeProps } from "@/domain/entities/challenge.entity";

import { ProblemBrowserResults } from "./ProblemBrowserResults";

type ProblemBrowserProps = {
  initialChallenges: ChallengeProps[];
};

export function ProblemBrowser({ initialChallenges }: ProblemBrowserProps) {
  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[32px] px-[16px] py-[40px] md:px-[24px] md:py-[56px]">
      <header className="flex flex-col gap-[12px]">
        <span className="font-mono text-[14px] text-mute">
          {"// design pattern katas"}
        </span>
        <h1 className="font-mono text-[32px] font-bold leading-[1.2] text-ink md:text-[40px]">
          Pick a problem.
        </h1>
        <p className="max-w-[560px] font-mono text-[16px] leading-[1.6] text-body">
          Refactor real-world code into clean, extensible designs. Each kata
          drops you into an editor with a failing starter and an AI reviewer.
        </p>
      </header>
      <ProblemBrowserResults initialChallenges={initialChallenges} />
    </div>
  );
}
