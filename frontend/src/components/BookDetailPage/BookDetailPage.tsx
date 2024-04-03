import {Book} from "../../types/Book.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import "./BookDetailPage.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import {DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Checkboxes from "../Checkboxes/Checkboxes.tsx";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


export default function BookDetailPage() {
    const {id} = useParams<{id: string}>();
    const [book, setBook] = useState<Book | null>(null)
    const [bookImage, setBookImage] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
    const [read, setRead] = useState(book?.read || false);
    const [favorite, setFavorite] = useState(book?.favorite || false);


    useEffect(() => {
        axios.get(`/api/books/${id}`)
            .then(response => {
                setBook(response.data);
            })
            .catch(error => {
                console.error('Error fetching Book: ', error);
                console.error('Error Details: ', error.response);
            });
    }, [id]);

    useEffect(() => {
        if (book) {
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`)
                .then(response => {
                   const data = response.data;
                   const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
                   if (thumbnail) {
                       setBookImage(thumbnail);
                   }
                })
                .catch(error => {
                    console.error('Error fetching Book Image: ', error);
                    console.error('Error Details: ', error.response);
                });
        }
    }, [book]);

    function handleClickDialogOpen() {
        if(book) {
            setRead(book.read);
            setFavorite(book.favorite);
        }
        setOpen(true);
    }

    function handleClickDialogClose() {
        setOpen(false);
    }

    function updateBook(book: Book) {
        axios.put(`/api/books/${id}`, book)
            .then(response => {
                setBook(response.data);
            })
            .catch(error => {
                console.error('Error updating Book: ', error);
                console.error('Error Details: ', error.response);
            });
    }

    function deleteBook() {
        if(window.confirm("Buch wirklich löschen?")) {
            axios.delete(`/api/books/${id}`)
                .then(() => {
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error deleting Book: ', error);
                    console.error('Error Details: ', error.response);
                });
        }
    }

    return (
        <>
            <div className={"link-wrapper"}>
                <div className={"link-icon-wrapper"}>
            <Link className={"back-link"} to={'/'}><ArrowBackIosIcon/> Übersicht</Link>
                    {book?.read ? <img src={"/book-filled.svg"} className={"read-icon-filled"} alt={"a filled book"}/> : <img src={"/book-outlined.svg"} className={"read-icon-outlined"} alt={"an outlined book"}/> }
                    {book?.favorite ? <FavoriteIcon className={"favorite-icon"}/> : <FavoriteBorderIcon className={"favorite-icon"}/> }
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
                </Dialog>
            </div>
                {book && (
                <div className={"book-details-wrapper"}>
                    {bookImage && <img src={bookImage} alt={"Buchcover"}/>}
                    <div className={"book-details"}>
                    <h2 className={"header-md"}>{book.title}</h2>
                    <h3 className={"header-sm"}>{book.author}</h3>
                    <p>{book.publisher}</p>
                    <p>{book.genre}</p>
                    <p className={"book-details--description"}>{book.blurb}</p>
                    </div>
                </div>
            )}
        </>
    )
}