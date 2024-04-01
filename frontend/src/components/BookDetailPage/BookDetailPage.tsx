import {Book} from "../../types/Book.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import "./BookDetailPage.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function BookDetailPage() {
    const {id} = useParams<{id: string}>();
    const [book, setBook] = useState<Book | null>(null)
    const [bookImage, setBookImage] = useState<string | null>(null)

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


    return (
        <div>
            <div className={"link-wrapper"}>
            <Link className={"back-link"} to={'/'}><ArrowBackIosIcon/> Übersicht</Link>
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
        </div>
    )
}