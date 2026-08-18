import type { Book } from "@/domain/entities/book.entity";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <li
      className="flex items-center justify-between px-[16px] py-[12px] font-mono"
      data-testid="book-card"
    >
      <div>
        <p className="text-[16px] text-ink" data-testid="book-card-title">
          {book.title}
        </p>
        <p className="text-[14px] text-mute" data-testid="book-card-author">
          {book.author}
        </p>
      </div>
    </li>
  );
}
