import {CombinedBook} from "../../types/CombinedBook.ts";
import BookCard from "../BookCard/BookCard.tsx";

type FavoriteBooksPageProps = {
    fetchFavoriteBooks: () => void,
    favorites: CombinedBook[]
}

export default function FavoriteBooksPage(props: Readonly<FavoriteBooksPageProps>) {
    return (
        <>
            <h1>Favorite Books</h1>

            <div className={"book-card"}>
                {props.favorites.map(book =>
                    <BookCard key={book.id} book={book}/>)}
            </div>
        </>
    )
}