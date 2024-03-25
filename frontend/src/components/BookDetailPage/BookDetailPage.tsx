import {Book} from "../../types/Book.ts";

type BookDetailPageProps = {
    books: Book[],
}
export default function BookDetailPage(props: Readonly<BookDetailPageProps>) {
    return (
        <div>
            <h1>Book Detail Page</h1>
        </div>
    )
}