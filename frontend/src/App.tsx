import {useEffect, useState} from "react";
import {Book} from "./types/Book.ts";
import BookOverview from "./components/BookOverview/BookOverview.tsx";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import AddNewBookPage from "./components/AddNewBook/AddNewBookPage.tsx";
import {CombinedBook} from "./types/CombinedBook.ts";
import FavoriteBooksPage from "./components/FavoritesPage/FavoriteBooksPage.tsx";
import {GoogleBook} from "./types/GoogleBook.ts";
import {BookDto} from "./types/BookDto.ts";



    function convertToBookDto(googleBook: GoogleBook, isFavorite:boolean, isRead:boolean) : BookDto{
    return {
        title: googleBook.volumeInfo.title || "",
        author: googleBook.volumeInfo.authors ? googleBook.volumeInfo.authors.join(", ") : "",
        genre: googleBook.volumeInfo.categories ? googleBook.volumeInfo.categories.join(", ") : "",
        publisher: googleBook.volumeInfo.publisher || "",
        isbn: googleBook.volumeInfo.industryIdentifiers ? googleBook.volumeInfo.industryIdentifiers[0].identifier : "",
        favorite: isFavorite,
        read: isRead,
        blurb: googleBook.volumeInfo.description || ""
    }
}


export default function App() {
    const [books, setBooks] = useState<CombinedBook[]>([])
    const [favorites, setFavorites] = useState<CombinedBook[]>([])
    const [isRead, setIsRead] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);



    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
       axios.get('/api/books')
           .then(response => {
               const books = response.data;
               const promises = books.map(async (book: Book) => {
                   const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.isbn}`);
                   return {...book, volumeInfo: googleResponse.data.items[0].volumeInfo};
               } );
                return Promise.all(promises);
              })
                .then(combinedBooks => {
                    setBooks(combinedBooks);
           })
           .catch(error => {
               console.error('Error fetching Books: ', error);
               console.error('Error Details: ', error.response);
           });
    }

    const fetchFavoriteBooks = () => {
        axios.get('/api/books/favorites')
            .then(response => {
                const books = response.data;
                const promises = books.map(async (book: Book) => {
                    const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.isbn}`);
                    return {...book, volumeInfo: googleResponse.data.items[0].volumeInfo};
                } );
                return Promise.all(promises);
            })
            .then(combinedBooks => {
                setFavorites(combinedBooks);
            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
                console.error('Error Details: ', error.response);
            });
    }

    async function fetchDbBooks(): Promise<BookDto[]> {
        await axios.get('/api/books')
            .then(response => {
                return(response.data);
            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
                console.error('Error Details: ', error.response);
            });
        return [];
    }

  return (
      <>
          <Routes>
                <Route path={"/"} element={<BookOverview books={books} fetchBooks={fetchBooks}/>}/>
                <Route path={"/books/:id"} element={<BookDetailPage />}/>
                <Route path={"/add"} element={<AddNewBookPage convertToBookDto={convertToBookDto} isFavorite={isFavorite} isRead={isRead} setIsFavorite={setIsFavorite} setIsRead={setIsRead} fetchDbBooks={fetchDbBooks}/>}/>
                <Route path={"/favorites"} element={<FavoriteBooksPage favorites={favorites} fetchFavoriteBooks={fetchFavoriteBooks}/>}/>
          </Routes>
          <Navbar fetchBooks={fetchBooks} fetchFavoriteBooks={fetchFavoriteBooks}/>
      </>

  )
}
