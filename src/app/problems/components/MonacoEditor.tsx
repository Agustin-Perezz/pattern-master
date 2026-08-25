"use client";

import type { BeforeMount, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import {
  EDITOR_MODEL_PATH,
  EDITOR_OPTIONS,
  MONACO_THEME,
  MONACO_THEME_DEFINITION,
} from "./config/monaco-config";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export type MonacoEditorProps = {
  initialCode: string;
  onChange: (code: string) => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
};

export function MonacoEditor({
  initialCode,
  onChange,
  onMount,
}: MonacoEditorProps) {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleChange = useCallback(
    (value: string | undefined) => {
      const next = value ?? "";
      setCode(next);
      onChange(next);
    },
    [onChange],
  );

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme(MONACO_THEME, MONACO_THEME_DEFINITION);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      jsx: monaco.languages.typescript.JsxEmit.React,
      noEmit: true,
      allowNonTsExtensions: true,
    });
  }, []);

  const handleMount: OnMount = useCallback(
    (editorInstance) => {
      onMount(editorInstance);
    },
    [onMount],
  );

  return (
    <Monaco
      height="100%"
      defaultLanguage="typescript"
      path={EDITOR_MODEL_PATH}
      value={code}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      theme={MONACO_THEME}
      options={EDITOR_OPTIONS}
    />
  );
}
