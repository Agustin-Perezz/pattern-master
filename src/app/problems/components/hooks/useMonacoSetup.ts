import type { BeforeMount } from "@monaco-editor/react";

import { MONACO_THEME, MONACO_THEME_DEFINITION } from "../config/monaco-config";

export function useMonacoSetup() {
  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme(MONACO_THEME, MONACO_THEME_DEFINITION);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      jsx: monaco.languages.typescript.JsxEmit.React,
      noEmit: true,
      allowNonTsExtensions: true,
    });
  };

  return { handleBeforeMount };
}
