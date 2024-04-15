import {GoogleBook} from "../../types/GoogleBook.ts";
import "./BookDetails.css";


type BookDetailsProps = {
    selectedBook: GoogleBook;
};

export default function BookDetails({selectedBook}: Readonly<BookDetailsProps>) {
    return (
        <div className={"selected-book-wrapper"}>
            <img className={"book-img"} src={selectedBook.volumeInfo.imageLinks?.thumbnail}
                 alt={selectedBook.volumeInfo.title}/>
            <div className={"information-wrapper"}>
                <p className={"information-title"}><span>Titel:</span> {selectedBook.volumeInfo.title}</p>
                <p className={"information-author"}><span>Autor:</span> {selectedBook.volumeInfo.authors?.join(", ")}</p>
                <p className={"information-publisher"}><span>Verlag:</span> {selectedBook.volumeInfo.publisher}</p>
                <p className={"information-category"}><span>Genre:</span> {selectedBook.volumeInfo.categories?.join(", ")}</p>
                <p className={"description-text"}>
                    <span>Beschreibung:</span> {selectedBook.volumeInfo.description}
                </p>
            </div>
        </div>
    )
}

