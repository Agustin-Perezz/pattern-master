import { highlight } from "./CodeHighlight";

type CodeBlockProps = {
  code: string;
  caption?: string;
};

export function CodeBlock({ code, caption }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-transparent bg-surface-dark">
      {caption ? (
        <div className="flex items-center gap-[8px] border-b border-surface-dark-elevated px-[16px] py-[8px] font-mono text-[14px] text-on-dark-mute">
          {caption}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-[16px] py-[12px] font-mono text-[14px] leading-[1.6] text-on-dark">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}
