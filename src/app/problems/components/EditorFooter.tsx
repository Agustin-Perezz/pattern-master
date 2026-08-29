import { Loader2, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/opencode/button";

type EditorFooterProps = {
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
};

export function EditorFooter({
  onReset,
  onSubmit,
  isSubmitting,
  error,
}: EditorFooterProps) {
  return (
    <div className="flex shrink-0 flex-col gap-[8px] border-t border-surface-dark-elevated px-[16px] py-[12px]">
      {error && <EditorFooterError message={error} />}
      <div className="flex items-center justify-end gap-[12px]">
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw className="size-[16px]" aria-hidden />
          Reset Code
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-[16px] animate-spin" aria-hidden />
          ) : (
            <Play className="size-[16px]" aria-hidden />
          )}
          {isSubmitting ? "Evaluating…" : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}

type EditorFooterErrorProps = {
  message: string;
};

function EditorFooterError({ message }: EditorFooterErrorProps) {
  return (
    <p role="alert" className="text-[13px] text-danger">
      {message}
    </p>
  );
}
