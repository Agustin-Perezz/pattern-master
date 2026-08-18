import { Search } from "lucide-react";

import { Input } from "@/components/opencode/input";

type ProblemSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProblemSearchInput({
  value,
  onChange,
}: ProblemSearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-[12px] top-1/2 size-[16px] -translate-y-1/2 text-mute"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search problems..."
        aria-label="Search problems"
        className="pl-[36px]"
      />
    </div>
  );
}
