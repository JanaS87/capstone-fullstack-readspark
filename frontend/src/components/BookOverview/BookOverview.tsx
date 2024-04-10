
import BookCard from "../BookCard/BookCard.tsx";
import "./BookOverview.css";
import {GoogleBook} from "../../types/GoogleBook.ts";
type BookOverviewProps = {
    books: GoogleBook[];
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