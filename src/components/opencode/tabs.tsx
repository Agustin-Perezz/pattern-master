"use client";

import { Button } from "./button";

export type TabItem = {
  value: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, onValueChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="View"
      className={`flex items-end gap-[4px] border-b border-hairline ${className ?? ""}`}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Button
            key={item.value}
            role="tab"
            aria-selected={active}
            variant={active ? "tab-active" : "tab"}
            size="tab"
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
