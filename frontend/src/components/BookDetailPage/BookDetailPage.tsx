import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import "./BookDetailPage.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CreateIcon from '@mui/icons-material/Create';
import {GoogleBook} from "../../types/GoogleBook.ts";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Checkboxes from "../Checkboxes/Checkboxes.tsx";

type BookDetailPageProps = {
    removeBook: (id: string) => void,
    updateBook: (book: GoogleBook) => void,
    addReadBook: (id: string) => void,
    addFavorite: (id: string) => void,
    removeFavorite: (id: string) => void,
    removeReadBook: (id: string) => void,


}

export default function BookDetailPage(props: Readonly<BookDetailPageProps>) {
    const [book, setBook] = useState<GoogleBook>()
    const [bookImage, setBookImage] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
    const {id} = useParams<{id: string}>();


    // fetchBookByIsbn wird aufgerufen, wenn die Komponente gerendert wird
    useEffect(() => {
        if (id) {
            fetchBookById(id);
        }
    }, [id]);


    //Buch über die isbn abrufen mit axios
    function fetchBookById(id: string) {
        axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
            .then(response => {
                if (response.data.volumeInfo) {
                    const book = (response.data);
                    setBook(book);
                   setBookImage(book.volumeInfo.imageLinks.thumbnail)
                } else {
                    console.error('No book found for Id: ', id);
                }
                })
            .catch(error => {
                console.error('Error fetching Books: ', error);
            })


    }



  function handleClickDialogOpen() {
        setOpen(true);
    }

    function handleClickDialogClose() {
        setOpen(false);
    }

    return (
        <>
            <div className={"link-wrapper"}>
                <div className={"link-icon-wrapper"}>
            <Link className={"back-link"} to={'/'}><ArrowBackIosIcon/> Übersicht</Link>
                    {/*{book?.read ? <img src={"/book-filled.svg"} className={"read-icon-filled"} alt={"a filled book"}/> : <img src={"/book-outlined.svg"} className={"read-icon-outlined"} alt={"an outlined book"}/> }*/}
                    {/*{book?.favorite ? <FavoriteIcon className={"favorite-icon"}/> : <FavoriteBorderIcon className={"favorite-icon"}/> }*/}
              <CreateIcon className={"edit-icon"} onClick={handleClickDialogOpen} />
                </div>
                <Dialog open={open} onClose={handleClickDialogClose}>
                    <DialogTitle>Info aktualisieren</DialogTitle>
                    <DialogContent>
                        <Checkboxes checked={read} onChange={(event) => setRead(event.target.checked)} label={"Gelesen"}/>
                        <Checkboxes checked={favorite} onChange={(event) => setFavorite(event.target.checked)} label={"Favorit"}/>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleClickDialogClose}>Abbrechen</button>
                        <button onClick={() => {
                            if(book?.id){
                            updateBook({...book, read, favorite});
                            handleClickDialogClose();
                        }}}>Speichern</button>
                        <button onClick={deleteBook}>Löschen</button>
                    </DialogActions>
                </Dialog>*
            </div>
                {book && (
                <div className={"book-details-wrapper"}>
                    {bookImage && <img src={bookImage} alt={"Buchcover"}/>}
                    <div className={"book-details"}>
                    <h2 className={"header-md"}>{book.volumeInfo.title}</h2>
                    <h3 className={"header-sm"}>{book.volumeInfo.authors}</h3>
                    <p>{book.volumeInfo.publisher}</p>
                    <p>{book.volumeInfo.categories}</p>
                    <p className={"book-details--description"}>{book.volumeInfo.description}</p>
                    </div>
                </div>
            )}
        </>
    )
}