import {Book} from "../../types/Book.ts";

type BookCardProps = {
    book: Book,

}
export default function BookCard(props: Readonly<BookCardProps>) {
    return (
        <div className={"BookCard"} >
            <h2 className={"BookTitle"}>{props.book.title}</h2>
            <h3 className={"BookAuthor"}>{props.book.author}</h3>
        </div>
    )
}