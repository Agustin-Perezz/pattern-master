import { MonacoEditor } from "../[slug]/components/MonacoEditor";

type CodeEditorBodyProps = {
  code: string;
  onChange: (code: string) => void;
};

export function CodeEditorBody({ code, onChange }: CodeEditorBodyProps) {
  return (
    <div className="min-h-0 flex-1">
      <MonacoEditor initialCode={code} onChange={onChange} />
    </div>
  );
}
