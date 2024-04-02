import {CombinedBook} from "../../types/CombinedBook.ts";

type FavoriteBooksPageProps = {
    fetchFavoriteBooks: () => void,
    favorites: CombinedBook[]
}

export default function FavoriteBooksPage(props: Readonly<FavoriteBooksPageProps>) {
    return (
        <div>
            <h1>Favorite Books</h1>
        </div>
    )
}