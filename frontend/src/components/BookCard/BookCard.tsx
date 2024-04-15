import {Link, } from "react-router-dom";
import "./BookCard.css";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {AppUser} from "../../types/AppUser.ts";
import {faBookOpen, faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


type BookCardProps = {
    book: GoogleBook,
    appUser: AppUser,
}

export default function BookCard(props: Readonly<BookCardProps>) {
       const isRead = props.appUser.readBookIds.includes(props.book.id);
         const isFavorite = props.appUser.favoriteBookIds.includes(props.book.id);

    return (
        <Link to={"/books/" + props.book.id} className={"BookCard"}>
            <div className={"book-card-container"}>
                <img className={"small-thumbnail"} src={props.book.volumeInfo.imageLinks?.smallThumbnail}
                     alt={props.book.volumeInfo.title}/>
                <div className={"book-card-info-container"}>
                    <h2 className={"BookTitle"}>{props.book.volumeInfo.title}</h2>
                    <h3 className={"BookAuthor"}>{props.book.volumeInfo.authors}</h3>
                </div>
                <div className={"icon-wrapper"}>
                    {isRead && <FontAwesomeIcon icon={faBookOpen} style={{color: "#000",}}/>}
                    {isFavorite && <FontAwesomeIcon icon={faHeart} style={{color: "#000",}}/>}
                </div>
            </div>
        </Link>
    )
}