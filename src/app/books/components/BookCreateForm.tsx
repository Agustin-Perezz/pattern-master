import { Button } from "@/components/ui/button";
import { createBook } from "../actions";
import { BookFormFields } from "./BookFormFields";

export function BookCreateForm() {
  return (
    <form
      action={createBook}
      className="flex flex-col gap-[8px] sm:flex-row"
      data-testid="book-create-form"
    >
      <BookFormFields />
      <Button type="submit" data-testid="book-submit-button">
        Add
      </Button>
    </form>
  );
}
