"use client";

import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";

export const MonacoEditorRoot = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export type MonacoEditorProps = {
  initialCode: string;
  onChange: (code: string) => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
};
