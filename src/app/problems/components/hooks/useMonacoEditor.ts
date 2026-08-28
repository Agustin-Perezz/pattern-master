import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";

import { useMonacoSetup } from "./useMonacoSetup";

type UseMonacoEditorArgs = {
  initialCode: string;
  onChange: (code: string) => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
};

export function useMonacoEditor({
  initialCode,
  onChange,
  onMount,
}: UseMonacoEditorArgs) {
  const [code, setCode] = useState(initialCode);
  const { handleBeforeMount } = useMonacoSetup();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleChange = useCallback(
    (value: string | undefined) => {
      setCode(value ?? "");
      onChange(value ?? "");
    },
    [onChange],
  );

  const handleMount: OnMount = useCallback(
    (editorInstance) => onMount(editorInstance),
    [onMount],
  );

  return { code, handleChange, handleMount, handleBeforeMount };
}
