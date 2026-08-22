import { ProblemTopNav } from "../components/ProblemTopNav";

export default function Loading() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <ProblemTopNav />
      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex flex-col gap-[16px] border-b border-hairline bg-surface-soft p-[24px] md:w-2/5 md:border-b-0 md:border-r">
          <div className="h-[32px] w-[60%] animate-pulse rounded-sm bg-surface-card" />
          <div className="h-[16px] w-full animate-pulse rounded-sm bg-surface-card" />
          <div className="h-[16px] w-[90%] animate-pulse rounded-sm bg-surface-card" />
          <div className="h-[16px] w-[80%] animate-pulse rounded-sm bg-surface-card" />
          <div className="mt-[16px] h-[120px] w-full animate-pulse rounded-sm bg-surface-card" />
          <div className="h-[16px] w-[70%] animate-pulse rounded-sm bg-surface-card" />
          <div className="h-[16px] w-[85%] animate-pulse rounded-sm bg-surface-card" />
        </div>
        <div className="flex h-full min-h-0 w-full flex-col bg-surface-dark md:w-3/5">
          <div className="flex h-[40px] shrink-0 items-center gap-[8px] border-b border-surface-dark-elevated px-[16px]">
            <div className="h-[24px] w-[120px] animate-pulse rounded-sm bg-surface-dark-elevated" />
          </div>
          <div className="flex-1 animate-pulse bg-surface-dark" />
          <div className="flex h-[64px] shrink-0 items-center justify-end gap-[12px] border-t border-surface-dark-elevated px-[16px]">
            <div className="h-[32px] w-[100px] animate-pulse rounded-sm bg-surface-dark-elevated" />
            <div className="h-[32px] w-[160px] animate-pulse rounded-sm bg-surface-dark-elevated" />
          </div>
        </div>
      </main>
    </div>
  );
}
