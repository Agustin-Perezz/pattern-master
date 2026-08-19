"use client";

import { Play, RotateCcw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/opencode/button";
import type { ChallengeProps } from "@/domain/entities/challenge.entity";

import { CodeEditorBody } from "./CodeEditorBody";

type CodeEditorProps = {
  problem: ChallengeProps;
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

export function CodeEditor({
  problem,
  onSubmit,
  isSubmitting,
  error,
}: CodeEditorProps) {
  const [code, setCode] = React.useState(problem.editorCode);

  React.useEffect(() => {
    setCode(problem.editorCode);
  }, [problem.editorCode]);

  const handleReset = React.useCallback(() => {
    setCode(problem.editorCode);
  }, [problem.editorCode]);

  const handleSubmit = React.useCallback(() => {
    onSubmit(code);
  }, [code, onSubmit]);

  return (
    <section
      aria-label="Code editor"
      className="flex h-full min-h-0 w-full flex-col bg-surface-dark md:w-3/5"
    >
      <EditorHeader file={problem.editorFile} />
      <CodeEditorBody code={code} onChange={setCode} />
      <EditorFooter
        onReset={handleReset}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </section>
  );
}

function EditorHeader({ file }: { file: string }) {
  return (
    <div className="flex h-[40px] shrink-0 items-center gap-[8px] border-b border-surface-dark-elevated px-[16px]">
      <span className="flex items-center gap-[8px] rounded-sm bg-surface-dark-elevated px-[12px] py-[4px] font-mono text-[14px] text-on-dark">
        <span className="size-[8px] rounded-full bg-warning" aria-hidden />
        {file}
      </span>
    </div>
  );
}

type EditorFooterProps = {
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
};

function EditorFooter({
  onReset,
  onSubmit,
  isSubmitting,
  error,
}: EditorFooterProps) {
  return (
    <div className="flex shrink-0 flex-col gap-[8px] border-t border-surface-dark-elevated px-[16px] py-[12px]">
      {error && <EditorFooterError message={error} />}
      <div className="flex items-center justify-end gap-[12px]">
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw className="size-[16px]" aria-hidden />
          Reset Code
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
          <Play className="size-[16px]" aria-hidden />
          Submit for Review
        </Button>
      </div>
    </div>
  );
}

type EditorFooterErrorProps = {
  message: string;
};

function EditorFooterError({ message }: EditorFooterErrorProps) {
  return (
    <p role="alert" className="text-[13px] text-danger">
      {message}
    </p>
  );
}
