import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import "./BookDetailPage.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {GoogleBook} from "../../types/GoogleBook.ts";
import axios from "axios";
import { IconButton} from "@mui/material";
import {AppUser} from "../../types/AppUser.ts";
import {faBook, faBookOpen, faHeart, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BookDetails from "../BookDetails/BookDetails.tsx";

type BookDetailPageProps = {
    removeBook: (id: string) => void,
    appUser: AppUser,
    addReadBook: (id: string) => void,
    removeReadBook: (id: string) => void,
    addFavoriteBook: (id: string) => void,
    removeFavoriteBook: (id: string) => void,
}

export default function BookDetailPage(props: Readonly<BookDetailPageProps>) {
    const [book, setBook] = useState<GoogleBook>();
    const [read, setRead] = useState(book ? props.appUser.readBookIds.includes(book.id) : false);
    const [favorite, setFavorite] = useState(book ? props.appUser.favoriteBookIds.includes(book.id) : false);
    const {id} = useParams<{ id: string }>();

    // fetchBookByIsbn wird aufgerufen, wenn die Komponente gerendert wird
    useEffect(() => {
        if (id) {
            fetchBookById(id);
        }
        // eslint-disable-next-line
    }, [id]);


    //Buch über die isbn abrufen mit axios
    function fetchBookById(id: string) {
        axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
            .then(response => {
                if (response.data.volumeInfo) {
                    const book = (response.data);
                    setBook(book);
                    setRead(props.appUser.readBookIds.includes(book.id))
                    setFavorite(props.appUser.favoriteBookIds.includes(book.id))
                } else {
                    console.error('No book found for Id: ', id);
                }
            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
            })
    }

    function handleRead() {
        if (read && book) {
            props.removeReadBook(book.id)
            setRead(false)
        }
        if (!read && book) {
            props.addReadBook(book.id)
            setRead(true)
        }
    }

    function handleFavorite() {
        if (favorite && book) {
            props.removeFavoriteBook(book.id)
            setFavorite(false)
        }
        if (!favorite && book) {
            props.addFavoriteBook(book.id)
            setFavorite(true)
        }
    }

    function handleDelete() {
        if (book) {
            props.removeBook(book.id)
        }
    }

    if (!book) {
        return <div>loading...</div>
    }


    return (
        <>
            <div className={"link-wrapper"}>
                <div className={"link-icon-wrapper"}>
                    <Link className={"back-link"} to={'/'}><ArrowBackIosIcon/> Übersicht</Link>
                    {read ?
                        (<IconButton onClick={handleRead} aria-label="read"><FontAwesomeIcon icon={faBookOpen} style={{color: "#000",}}/></IconButton>)
                        :
                        (<IconButton onClick={handleRead} aria-label="read"><FontAwesomeIcon icon={faBook} style={{color: "#000",}} /></IconButton>)}
                    {favorite ?
                        (<IconButton onClick={handleFavorite} aria-label="favorite"><FontAwesomeIcon icon={faHeart} style={{color: "#000",}} /></IconButton>)
                        :
                        (<IconButton onClick={handleFavorite} aria-label="favorite"><FontAwesomeIcon icon={faHeart} style={{color: "#000",}} /></IconButton>)}
                    <IconButton onClick={handleDelete} aria-label="delete"><FontAwesomeIcon icon={faTrash} style={{color: "#000",}} /></IconButton>
                </div>
            </div>
            {book && (
                <BookDetails selectedBook={book}/>
            )}
        </>
    )
}