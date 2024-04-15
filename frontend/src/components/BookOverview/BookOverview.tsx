
import BookCard from "../BookCard/BookCard.tsx";
import "./BookOverview.css";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {AppUser} from "../../types/AppUser.ts";
import {Link} from "react-router-dom";
type BookOverviewProps = {
    books: GoogleBook[],
    appUser: AppUser
}
export default function BookOverview(props: Readonly<BookOverviewProps>) {

    return (
        <div className={"book-container"} >
            <div className={"header-wrapper"}>
            <h1 className={"header-title"}>Übersicht</h1>
            </div>
            <div className={"book-card"}>
                {props.books.length > 0 ? (
                props.books.map(book =>
                    <BookCard key={book.id}
                              book={book}
                              appUser={props.appUser}
                    />)
                ) : (
                    <div className={"no-books-wrapper"}>
                        <h2>Ganz schön leer hier...</h2>
                        <p>Füge dein erstes Buch hinzu!</p>
                        <Link to={"/add"} className={"add-book-link"}>Buch hinzufügen</Link>
                    </div>
                )}
            </div>
        </div>
    )
}