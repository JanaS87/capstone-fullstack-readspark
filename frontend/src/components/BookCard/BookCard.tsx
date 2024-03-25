import {Book} from "../../types/Book.ts";
import {useNavigate} from "react-router-dom";

type BookCardProps = {
    book: Book,

}
export default function BookCard(props: Readonly<BookCardProps>) {
    const navigate = useNavigate()

    function navigateToDetailPage() {
        navigate("/books/" + props.book.id)
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if(event.key === "Enter") {
            navigateToDetailPage()
        }
    }

    return (
        <div className={"BookCard"}
             onClick={navigateToDetailPage}
             onKeyDown={handleKeyDown}
             tabIndex={0}>
            <h2 className={"BookTitle"}>{props.book.title}</h2>
            <h3 className={"BookAuthor"}>{props.book.author}</h3>
        </div>
    )
}