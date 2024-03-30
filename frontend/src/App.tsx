import {useEffect, useState} from "react";
import {Book} from "./types/Book.ts";
import BookOverview from "./components/BookOverview/BookOverview.tsx";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import AddNewBookPage from "./components/AddNewBook/AddNewBookPage.tsx";
import {CombinedBook} from "./types/CombinedBook.ts";

export default function App() {
    const [books, setBooks] = useState<CombinedBook[]>([])

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
  return (
      <>
          <Routes>
                <Route path={"/"} element={<BookOverview books={books} fetchBooks={fetchBooks}/>}/>
                <Route path={"/books/:id"} element={<BookDetailPage />}/>
                <Route path={"/add"} element={<AddNewBookPage />}/>
          </Routes>
          <Navbar fetchBooks={fetchBooks}/>
      </>

  )
}
