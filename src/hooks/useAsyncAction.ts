"use client";

import { useState } from "react";

type UseAsyncResult<TArgs extends unknown[]> = {
  isPending: boolean;
  run: (...args: TArgs) => Promise<void>;
};

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
): UseAsyncResult<TArgs> {
  const [isPending, setIsPending] = useState(false);

  async function run(...args: TArgs) {
    setIsPending(true);
    try {
      await action(...args);
    } finally {
      setIsPending(false);
    }
  }

  return { isPending, run };
}
