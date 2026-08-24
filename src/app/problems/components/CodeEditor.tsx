"use client";

import { Loader2, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/opencode/button";
import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { useVimMode } from "../hooks/useVimMode";

import { CodeEditorBody } from "./CodeEditorBody";
import { VimToggle } from "./VimToggle";

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
  const [code, setCode] = useState(problem.editorCode);
  const { vimEnabled, toggleVim, statusBarRef, onEditorMount } = useVimMode();

  useEffect(() => {
    setCode(problem.editorCode);
  }, [problem.editorCode]);

  const handleReset = useCallback(() => {
    setCode(problem.editorCode);
  }, [problem.editorCode]);

  const handleSubmit = useCallback(() => {
    onSubmit(code);
  }, [code, onSubmit]);

  return (
    <section
      aria-label="Code editor"
      className="flex h-full min-h-0 w-full flex-col bg-surface-dark md:w-3/5"
    >
      <EditorHeader file={problem.editorFile}>
        <VimToggle enabled={vimEnabled} onToggle={toggleVim} />
      </EditorHeader>
      <CodeEditorBody code={code} onChange={setCode} onMount={onEditorMount} />
      {vimEnabled && (
        <div
          ref={statusBarRef}
          className="shrink-0 border-t border-surface-dark-elevated bg-surface-dark px-[16px] py-[4px] font-mono text-[13px] text-on-dark-mute"
        />
      )}
      <EditorFooter
        onReset={handleReset}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </section>
  );
}

type EditorHeaderProps = {
  file: string;
  children?: React.ReactNode;
};

function EditorHeader({ file, children }: EditorHeaderProps) {
  return (
    <div className="flex h-[40px] shrink-0 items-center gap-[8px] border-b border-surface-dark-elevated px-[16px]">
      <span className="flex items-center gap-[8px] rounded-sm bg-surface-dark-elevated px-[12px] py-[4px] font-mono text-[14px] text-on-dark">
        <span className="size-[8px] rounded-full bg-warning" aria-hidden />
        {file}
      </span>
      {children}
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
          {isSubmitting ? (
            <Loader2 className="size-[16px] animate-spin" aria-hidden />
          ) : (
            <Play className="size-[16px]" aria-hidden />
          )}
          {isSubmitting ? "Evaluating…" : "Submit for Review"}
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
