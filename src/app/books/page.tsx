import { getBooks } from "./actions";
import { BookCreateForm } from "./components/BookCreateForm";
import { BookHeader } from "./components/BookHeader";
import { BookList } from "./components/BookList";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <main className="min-h-dvh bg-canvas font-mono">
      <div className="mx-auto max-w-[720px] px-[24px] py-[40px]">
        <BookHeader />
        <BookCreateForm />
        <BookList books={books} />
      </div>
    </main>
  );
}
