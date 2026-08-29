export function EditorHeader({
  file,
  children,
}: {
  file: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-[40px] shrink-0 items-center gap-[8px] border-b border-surface-dark-elevated px-[16px]">
      <span className="flex items-center gap-[8px] rounded-sm bg-surface-dark-elevated px-[12px] py-[4px] font-mono text-[14px] text-on-dark">
        <span className="size-[8px] rounded-full bg-warning" aria-hidden />
        {file}
      </span>
      {children}
    </div>
  );
}
