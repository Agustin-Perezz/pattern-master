"use client";

import type { TabItem } from "@/components/opencode/tabs";
import { Tabs } from "@/components/opencode/tabs";

const TAB_ITEMS: TabItem[] = [
  { value: "description", label: "Description" },
  { value: "evaluation", label: "AI Evaluation" },
];

type ProblemTabsProps = {
  description: React.ReactNode;
  evaluation: React.ReactNode;
  tab: string;
  onTabChange: (tab: string) => void;
};

export function ProblemTabs({
  description,
  evaluation,
  tab,
  onTabChange,
}: ProblemTabsProps) {
  return (
    <section
      aria-label="Context and evaluation"
      className="flex h-full min-h-0 w-full flex-col border-hairline md:w-2/5 md:border-r"
    >
      <div className="shrink-0 px-[16px] pt-[16px] md:px-[24px]">
        <Tabs items={TAB_ITEMS} value={tab} onValueChange={onTabChange} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[16px] py-[24px] md:px-[24px]">
        {tab === "description" ? description : evaluation}
      </div>
    </section>
  );
}
