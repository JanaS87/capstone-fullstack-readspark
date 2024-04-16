import {GoogleBook} from "../../types/GoogleBook.ts";
import "./BookDetails.css";
import {useState} from "react";
import {Button} from "@mui/material";


type BookDetailsProps = {
    selectedBook: GoogleBook;
};

export default function BookDetails({selectedBook}: Readonly<BookDetailsProps>) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    function handleToggleExpand() {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className={"blurry-background"}>
        <div className={"selected-book-wrapper"}>
                <img className={"book-img"} src={selectedBook.volumeInfo.imageLinks?.thumbnail}
                     alt={selectedBook.volumeInfo.title}/>
                <div className={"information-wrapper"}>
                    <p className={"information-title"}><span>Titel:</span> {selectedBook.volumeInfo.title}</p>
                <p className={"information-author"}><span>Autor:</span> {selectedBook.volumeInfo.authors?.join(", ")}</p>
                    <p className={"information-publisher"}><span>Verlag:</span> {selectedBook.volumeInfo.publisher}</p>
                <p className={"information-category"}><span>Genre:</span> {selectedBook.volumeInfo.categories?.join(", ")}</p>
                    <p className={"description-text"}>
                        <span>Beschreibung:</span>
                        {isExpanded ? selectedBook.volumeInfo.description
                            :
                            (selectedBook.volumeInfo.description?.substring(0, 200) + '...')}
                        <Button aria-label={"expand text"}
                                variant={"contained"}
                                onClick={handleToggleExpand}
                                className={"expand-button"}
                                style={{backgroundColor: "#423F3E", color: "white"}}
                                size={"small"}

                        >
                            {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                        </Button>
                    </p>
                </div>
        </div>
        </div>
    )
}

