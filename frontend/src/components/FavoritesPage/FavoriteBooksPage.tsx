import {AppUser} from "../../types/AppUser.ts";
import BookCard from "../BookCard/BookCard.tsx";
import {GoogleBook} from "../../types/GoogleBook.ts";
import "./FavoriteBooksPage.css";

type FavoriteBooksPageProps = {
    appUser: AppUser,
    books: GoogleBook[]
}

export default function FavoriteBooksPage(props: Readonly<FavoriteBooksPageProps>) {

    const getFavoriteBooks = () => {return  props.books.filter(book =>
        props.appUser.favoriteBookIds.includes(book.id));}

    const favoriteBooks = getFavoriteBooks();

    return (
            <div className={"favorite-book-wrapper"}>
            <div className={"header-wrapper"}>
            <h1 className={"header-title"}>Favoriten</h1>
                </div>
            <div className={"book-card"}>
                {favoriteBooks.map(book =>
                    <BookCard key={book.id}
                              book={book}
                              appUser={props.appUser}
                    />)}
            </div>
            </div>
    )
}