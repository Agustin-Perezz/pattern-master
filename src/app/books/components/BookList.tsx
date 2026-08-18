import type { Book } from "@/domain/entities/book.entity";
import { BookCard } from "./BookCard";
import { BookEmptyState } from "./BookEmptyState";

type BookListProps = {
  books: Book[];
};

export function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return <BookEmptyState />;
  }

  return (
    <ul
      className="mt-[24px] divide-y divide-hairline rounded-sm border border-hairline bg-surface-soft"
      data-testid="book-list"
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </ul>
  );
}
