import {Book} from "../../types/Book.ts";
import {Link} from "react-router-dom";

type BookCardProps = {
    book: Book,

}
export default function BookCard(props: Readonly<BookCardProps>) {


    return (
        <>
            <Link to={"/books/" + props.book.id} className={"BookCard"}>
            <h2 className={"BookTitle"}>{props.book.title}</h2>
            <h3 className={"BookAuthor"}>{props.book.author}</h3>
            </Link>
        </>
    )
}