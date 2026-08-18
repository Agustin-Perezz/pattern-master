export function BookHeader() {
  return (
    <header className="mb-[24px] font-mono" data-testid="books-header">
      <p className="text-[14px] text-mute">{"// your collection"}</p>
      <h1 className="text-[24px] font-bold text-ink">Books</h1>
      <p className="text-[14px] text-mute">Manage your reading collection.</p>
    </header>
  );
}
