import { cn } from "@/lib/utils";

import type { Filter } from "../hooks/useProblemFilter";

type FilterButtonProps = {
  filter: Filter;
  active: boolean;
  onClick: () => void;
};

export function FilterButton({ filter, active, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-sm border px-[14px] py-[6px] font-mono text-[14px] transition-colors",
        active
          ? "border-transparent bg-ink text-canvas"
          : "border-hairline-strong bg-transparent text-mute hover:text-ink",
      )}
    >
      {filter}
    </button>
  );
}
