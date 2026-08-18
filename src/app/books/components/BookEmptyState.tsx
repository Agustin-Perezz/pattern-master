export function BookEmptyState() {
  return (
    <div
      className="mt-[24px] rounded-sm border border-dashed border-hairline p-[32px] text-center font-mono"
      data-testid="book-empty-state"
    >
      <p className="text-[14px] text-mute">
        {"// no books yet — add one above"}
      </p>
    </div>
  );
}
