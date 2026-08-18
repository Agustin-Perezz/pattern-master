import { Check } from "lucide-react";

import { Badge } from "@/components/opencode/badge";

import { ScoreDialRing } from "./ScoreDialRing";

type ScoreDialProps = {
  score: number;
  note: string;
};

export function ScoreDial({ score, note }: ScoreDialProps) {
  return (
    <div className="flex items-center gap-[16px]">
      <ScoreDialRing score={score} />
      <div className="flex flex-col gap-[8px]">
        <Badge variant="success" className="gap-[6px]">
          <Check className="size-[14px]" aria-hidden />
          Pattern Applied: Yes
        </Badge>
        <p className="font-mono text-[14px] text-mute">{note}</p>
      </div>
    </div>
  );
}
