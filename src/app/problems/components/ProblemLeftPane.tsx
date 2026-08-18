"use client";

import { Check, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/opencode/badge";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@/components/opencode/card";
import { Tabs } from "@/components/opencode/tabs";
import type { Problem } from "@/lib/mock/problems";

import { CodeBlock } from "./CodeBlock";

type ProblemLeftPaneProps = {
  problem: Problem;
};

const PROBLEM_TAG = "[ problem ]";
const STARTER_LABEL = ">";

type DescriptionProps = {
  problem: Problem;
};

function Description({ problem }: DescriptionProps) {
  const [before, after] = problem.description.split("{code}");
  return (
    <p className="font-mono text-[16px] leading-[1.6] text-body">
      {before}
      {problem.descriptionCode ? (
        <code className="rounded-sm bg-surface-card px-[4px] text-ink">
          {problem.descriptionCode}
        </code>
      ) : null}
      {after}
    </p>
  );
}

type ScoreDialProps = {
  score: number;
  note: string;
};

const SCORE_DIAL_RADIUS = 52;
const SCORE_DIAL_STROKE_WIDTH = 8;
const SCORE_DIAL_VIEWBOX = 128;
const SCORE_DIAL_CENTER = 64;

function ScoreDial({ score, note }: ScoreDialProps) {
  const circumference = 2 * Math.PI * SCORE_DIAL_RADIUS;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-[16px]">
      <div className="relative size-[128px] shrink-0">
        <svg
          role="img"
          aria-label="Score dial"
          viewBox={`0 0 ${SCORE_DIAL_VIEWBOX} ${SCORE_DIAL_VIEWBOX}`}
          className="size-full -rotate-90"
        >
          <circle
            cx={SCORE_DIAL_CENTER}
            cy={SCORE_DIAL_CENTER}
            r={SCORE_DIAL_RADIUS}
            fill="none"
            stroke="var(--color-surface-card)"
            strokeWidth={SCORE_DIAL_STROKE_WIDTH}
          />
          <circle
            cx={SCORE_DIAL_CENTER}
            cy={SCORE_DIAL_CENTER}
            r={SCORE_DIAL_RADIUS}
            fill="none"
            stroke="var(--color-success)"
            strokeWidth={SCORE_DIAL_STROKE_WIDTH}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[28px] font-bold leading-none tabular-nums text-ink">
            {score}
          </span>
          <span className="font-mono text-[14px] text-mute">/100</span>
        </div>
      </div>
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

type FeedbackCardProps = {
  variant: "success" | "warning";
  title: string;
  children: React.ReactNode;
};

function FeedbackCard({ variant, title, children }: FeedbackCardProps) {
  const accent =
    variant === "success" ? "border-l-success" : "border-l-warning";
  const Icon = variant === "success" ? Check : TriangleAlert;
  const iconColor = variant === "success" ? "text-success" : "text-warning";
  return (
    <Card tone="soft" className={`border-l-4 ${accent}`}>
      <CardHeader className="mb-[8px] flex-row items-center gap-[8px]">
        <Icon className={`size-[16px] ${iconColor}`} aria-hidden />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody className="text-[14px] text-body">{children}</CardBody>
    </Card>
  );
}

const TAB_ITEMS = [
  { value: "description", label: "Description" },
  { value: "evaluation", label: "AI Evaluation" },
];

const SCORE_VALUE = 85;

export function ProblemLeftPane({ problem }: ProblemLeftPaneProps) {
  const [tab, setTab] = React.useState("description");

  return (
    <section
      aria-label="Context and evaluation"
      className="flex h-full min-h-0 w-full flex-col border-hairline md:w-2/5 md:border-r"
    >
      <div className="shrink-0 px-[16px] pt-[16px] md:px-[24px]">
        <Tabs items={TAB_ITEMS} value={tab} onValueChange={setTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-[16px] py-[24px] md:px-[24px]">
        {tab === "description" ? (
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <Badge variant="label">{PROBLEM_TAG}</Badge>
              <Badge variant="label">{problem.category}</Badge>
              <Badge variant="warning">{problem.difficulty}</Badge>
            </div>
            <h1 className="font-mono text-[24px] font-bold leading-[1.3] text-ink">
              {problem.title}
            </h1>
            <Description problem={problem} />
            <div className="flex flex-col gap-[8px]">
              <span className="font-mono text-[14px] text-mute">
                {STARTER_LABEL} Bad starter code
              </span>
              <CodeBlock
                code={problem.starterCode}
                caption={problem.starterFile}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[24px]">
            <ScoreDial
              score={SCORE_VALUE}
              note={`${problem.challenge} detected in your submission.`}
            />
            <div className="flex flex-col gap-[12px]">
              <FeedbackCard variant="success" title="Praise">
                Excellent job extracting the responsibilities into their own
                types and coding against an interface rather than concrete
                classes.
              </FeedbackCard>
              <FeedbackCard variant="warning" title="Critical Feedback">
                Consider injecting the dependency through the constructor
                instead of instantiating it inline &mdash; the current version
                is still tightly coupled.
              </FeedbackCard>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
