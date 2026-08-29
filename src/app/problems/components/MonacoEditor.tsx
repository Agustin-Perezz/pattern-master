"use client";

import {
  EDITOR_MODEL_PATH,
  EDITOR_OPTIONS,
  MONACO_THEME,
} from "./config/monaco-config";
import {
  type MonacoEditorProps,
  MonacoEditorRoot,
} from "./hooks/monaco-editor-root";
import { useMonacoEditor } from "./hooks/useMonacoEditor";

export function MonacoEditor(props: MonacoEditorProps) {
  const { code, handleChange, handleMount, handleBeforeMount } =
    useMonacoEditor(props);

  return (
    <MonacoEditorRoot
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
