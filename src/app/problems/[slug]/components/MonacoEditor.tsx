"use client";

import type { BeforeMount } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import * as React from "react";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const MONACO_THEME = "opencode-dark";

const MONACO_THEME_DEFINITION = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6e6e73", fontStyle: "italic" },
    { token: "keyword", foreground: "c678dd" },
    { token: "keyword.control", foreground: "c678dd" },
    { token: "keyword.operator", foreground: "c678dd" },
    { token: "string", foreground: "98c379" },
    { token: "string.escape", foreground: "d4a373" },
    { token: "number", foreground: "d4a373" },
    { token: "type", foreground: "61afef" },
    { token: "type.identifier", foreground: "61afef" },
    { token: "function", foreground: "e5c07b" },
    { token: "identifier", foreground: "f4f2f2" },
    { token: "variable", foreground: "f4f2f2" },
    { token: "variable.predefined", foreground: "e06c75" },
    { token: "delimiter", foreground: "9a9898" },
    { token: "delimiter.parenthesis", foreground: "9a9898" },
    { token: "namespace", foreground: "61afef" },
  ],
  colors: {
    "editor.background": "#201d1d",
    "editor.foreground": "#f4f2f2",
    "editorLineNumber.foreground": "#6e6e73",
    "editorLineNumber.activeForeground": "#f4f2f2",
    "editor.selectionBackground": "#302c2c",
    "editor.lineHighlightBackground": "#262222",
    "editorCursor.foreground": "#f4f2f2",
    "editorWhitespace.foreground": "rgba(244,242,242,0.08)",
    "editorIndentGuide.background": "rgba(244,242,242,0.08)",
    "editorIndentGuide.activeBackground": "rgba(244,242,242,0.15)",
    "editorGutter.background": "#201d1d",
    "editorWidget.background": "#262222",
    "editorWidget.border": "rgba(244,242,242,0.12)",
    "editorSuggestWidget.background": "#262222",
    "editorSuggestWidget.selectedBackground": "#302c2c",
    "scrollbarSlider.background": "rgba(244,242,242,0.08)",
    "scrollbarSlider.hoverBackground": "rgba(244,242,242,0.15)",
  },
};

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
  }, []);

  return (
    <Monaco
      height="100%"
      defaultLanguage="typescript"
      value={code}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      theme={MONACO_THEME}
      options={{ minimap: { enabled: false } }}
    />
  );
}
