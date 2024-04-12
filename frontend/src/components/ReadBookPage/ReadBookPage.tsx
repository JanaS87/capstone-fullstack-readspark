import {GoogleBook} from "../../types/GoogleBook.ts";
import {AppUser} from "../../types/AppUser.ts";
import BookCard from "../BookCard/BookCard.tsx";
import "./ReadBookPage.css";


type ReadBookPageProps = {
    appUser: AppUser,
    books: GoogleBook[]
}

export default function ReadBookPage(props: Readonly<ReadBookPageProps>) {

    const getReadBooks = () => {return  props.books.filter(book =>
        props.appUser.readBookIds.includes(book.id));}

    const readBooks = getReadBooks();

    return (
        <div className={"read-book-wrapper"}>
            <div className={"header-wrapper"}>
                <h1 className={"header-title"}>Gelesene Bücher</h1>
            </div>
            <div className={"book-card"}>
                {readBooks.map(book =>
                    <BookCard key={book.id}
                              book={book}
                              appUser={props.appUser}
                    />)}
            </div>
        </div>
    )
}