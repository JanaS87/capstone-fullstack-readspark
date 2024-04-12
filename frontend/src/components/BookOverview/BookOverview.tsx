
import BookCard from "../BookCard/BookCard.tsx";
import "./BookOverview.css";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {AppUser} from "../../types/AppUser.ts";
import {IconButton} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
type BookOverviewProps = {
    books: GoogleBook[],
    appUser: AppUser
}
export default function BookOverview(props: Readonly<BookOverviewProps>) {

    return (
        <div className={"book-container"} >
            <div className={"header-wrapper"}>
            <h1 className={"header-title"}>Übersicht</h1>
                <div className={"header-btn-wrapper"}>
                <IconButton><FontAwesomeIcon icon={faPlus} style={{color: "#000",}} size="lg"  /></IconButton>
                </div>
            </div>
            <div className={"book-card"}>
                {props.books.map(book =>
                    <BookCard key={book.id}
                              book={book}
                              appUser={props.appUser}
                    />)}
            </div>
        </div>
    )
}