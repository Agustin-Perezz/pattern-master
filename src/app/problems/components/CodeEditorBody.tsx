import { highlight } from "./CodeHighlight";

type CodeEditorBodyProps = {
  code: string;
};

export function CodeEditorBody({ code }: CodeEditorBodyProps) {
  const lines = code.split("\n");

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="flex min-h-full font-mono text-[14px] leading-[1.7]">
        <div
          aria-hidden
          className="select-none border-r border-surface-dark-elevated px-[12px] py-[16px] text-right text-on-dark-mute"
        >
          {lines.map((_line: string, index: number) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are stable for a static file
            <div key={`line-number-${index}`}>{index + 1}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto px-[16px] py-[16px] text-on-dark">
          <code>{highlight(code)}</code>
        </pre>
      </div>
    </div>
  );
}
