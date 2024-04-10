import {Link, } from "react-router-dom";
import "./BookCard.css";
import {GoogleBook} from "../../types/GoogleBook.ts";


type BookCardProps = {
    book: GoogleBook
}

export default function BookCard(props: Readonly<BookCardProps>) {

    return (
        <Link to={"/books/" + props.book.id} className={"BookCard"}>
            <div className={"book-card-container"}>
               <img className={"small-thumbnail"} src={props.book.volumeInfo.imageLinks.smallThumbnail} alt={props.book.volumeInfo.title}/>
                <div className={"book-card-info-container"}>
                <h2 className={"BookTitle"}>{props.book.volumeInfo.title}</h2>
                <h3 className={"BookAuthor"}>{props.book.volumeInfo.authors}</h3>
                </div>
                </div>
        </Link>
    )
}