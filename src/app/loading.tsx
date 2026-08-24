import { ProblemTopNav } from "./problems/components/ProblemTopNav";

const SKELETON_CARDS = ["a", "b", "c", "d"] as const;

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[32px] px-[16px] py-[40px] md:px-[24px] md:py-[56px]">
          <div className="flex flex-col gap-[12px]">
            <div className="h-[14px] w-[180px] animate-pulse rounded-sm bg-surface-card" />
            <div className="h-[32px] w-[200px] animate-pulse rounded-sm bg-surface-card md:h-[40px] md:w-[260px]" />
            <div className="h-[16px] w-full max-w-[560px] animate-pulse rounded-sm bg-surface-card" />
            <div className="h-[16px] w-[80%] max-w-[560px] animate-pulse rounded-sm bg-surface-card" />
          </div>
          <div className="flex items-center justify-between border-b border-hairline pb-[8px]">
            <div className="h-[14px] w-[100px] animate-pulse rounded-sm bg-surface-card" />
            <div className="h-[14px] w-[60px] animate-pulse rounded-sm bg-surface-card" />
          </div>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            {SKELETON_CARDS.map((key) => (
              <div
                key={key}
                className="flex flex-col gap-[12px] rounded-sm border border-hairline bg-surface-soft p-[20px]"
              >
                <div className="flex items-center gap-[8px]">
                  <div className="h-[24px] w-[60px] animate-pulse rounded-sm bg-surface-card" />
                  <div className="h-[24px] w-[60px] animate-pulse rounded-sm bg-surface-card" />
                </div>
                <div className="h-[18px] w-[80%] animate-pulse rounded-sm bg-surface-card" />
                <div className="h-[14px] w-full animate-pulse rounded-sm bg-surface-card" />
                <div className="h-[14px] w-[60%] animate-pulse rounded-sm bg-surface-card" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
