"use client";

import { useCallback, useEffect, useState } from "react";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { useVimMode } from "../hooks/useVimMode";
import { CodeEditorBody } from "./CodeEditorBody";
import { EditorFooter } from "./EditorFooter";
import { EditorHeader } from "./EditorHeader";
import { VimStatusBar, VimToggle } from "./VimToggle";

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

  const resetCode = useCallback(
    () => setCode(problem.editorCode),
    [problem.editorCode],
  );
  const submitCode = useCallback(() => onSubmit(code), [code, onSubmit]);

  return (
    <section
      aria-label="Code editor"
      className="flex h-full min-h-0 w-full flex-col bg-surface-dark md:w-3/5"
    >
      <EditorHeader file={problem.editorFile}>
        <VimToggle enabled={vimEnabled} onToggle={toggleVim} />
      </EditorHeader>
      <CodeEditorBody code={code} onChange={setCode} onMount={onEditorMount} />
      {vimEnabled && <VimStatusBar statusBarRef={statusBarRef} />}
      <EditorFooter
        onReset={resetCode}
        onSubmit={submitCode}
        isSubmitting={isSubmitting}
        error={error}
      />
    </section>
  );
}
