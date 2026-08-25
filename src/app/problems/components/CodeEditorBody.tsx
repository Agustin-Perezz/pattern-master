import type { editor } from "monaco-editor";

import { MonacoEditor } from "./MonacoEditor";

type CodeEditorBodyProps = {
  code: string;
  onChange: (code: string) => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
};

export function CodeEditorBody({
  code,
  onChange,
  onMount,
}: CodeEditorBodyProps) {
  return (
    <div className="min-h-0 flex-1">
      <MonacoEditor initialCode={code} onChange={onChange} onMount={onMount} />
    </div>
  );
}
