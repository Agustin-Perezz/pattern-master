"use client";

import type { BeforeMount } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import * as React from "react";

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
};

export function MonacoEditor({ initialCode, onChange }: MonacoEditorProps) {
  const [code, setCode] = React.useState(initialCode);

  React.useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleChange = React.useCallback(
    (value: string | undefined) => {
      const next = value ?? "";
      setCode(next);
      onChange(next);
    },
    [onChange],
  );

  const handleBeforeMount: BeforeMount = React.useCallback((monaco) => {
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

  return (
    <Monaco
      height="100%"
      defaultLanguage="typescript"
      path={EDITOR_MODEL_PATH}
      value={code}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      theme={MONACO_THEME}
      options={EDITOR_OPTIONS}
    />
  );
}
