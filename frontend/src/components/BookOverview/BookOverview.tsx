import {Book} from "../../types/Book.ts";
import BookCard from "../BookCard/BookCard.tsx";

type BookOverviewProps = {
    books: Book[],
    fetchBooks: () => void
}

export default function BookOverview(props: Readonly<BookOverviewProps>) {
    return (
        <div className={"book-container"} >
            <div className={"book-card"}>
                {props.books.map(book =>
                    <BookCard key={book.id}  book={book}/>)}
            </div>
        </div>
    )
}