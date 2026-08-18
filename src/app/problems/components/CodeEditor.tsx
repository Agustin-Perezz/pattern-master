import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/opencode/button";
import type { Problem } from "@/lib/mock/problems";

import { CodeEditorBody } from "./CodeEditorBody";

type CodeEditorProps = {
  problem: Problem;
};

export function CodeEditor({ problem }: CodeEditorProps) {
  return (
    <section
      aria-label="Code editor"
      className="flex h-full min-h-0 w-full flex-col bg-surface-dark md:w-3/5"
    >
      <div className="flex h-[40px] shrink-0 items-center gap-[8px] border-b border-surface-dark-elevated px-[16px]">
        <span className="flex items-center gap-[8px] rounded-sm bg-surface-dark-elevated px-[12px] py-[4px] font-mono text-[14px] text-on-dark">
          <span className="size-[8px] rounded-full bg-warning" aria-hidden />
          {problem.editorFile}
        </span>
      </div>

      <CodeEditorBody code={problem.editorCode} />

      <div className="flex shrink-0 items-center justify-end gap-[12px] border-t border-surface-dark-elevated px-[16px] py-[12px]">
        <Button variant="secondary">
          <RotateCcw className="size-[16px]" aria-hidden />
          Reset Code
        </Button>
        <Button variant="primary">
          <Play className="size-[16px]" aria-hidden />
          Submit for Review
        </Button>
      </div>
    </section>
  );
}
