import {CombinedBook} from "../../types/CombinedBook.ts";
import BookCard from "../BookCard/BookCard.tsx";
import "./BookOverview.css";

type BookOverviewProps = {
    books: CombinedBook[],
    fetchBooks: () => void
}
export default function BookOverview(props: Readonly<BookOverviewProps>) {

    return (
        <div className={"book-container"} >
            <h1 className={"header-title"}>Übersicht</h1>
            <div className={"book-card"}>
                {props.books.map(book =>
                    <BookCard key={book.id}  book={book}/>)}
            </div>
        </div>
    )
}