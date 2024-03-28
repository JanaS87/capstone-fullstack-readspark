import {useEffect, useState} from "react";
import {Book} from "./types/Book.ts";
import BookOverview from "./components/BookOverview/BookOverview.tsx";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";
import NewBookSearchbar from "./components/AddNewBook/NewBookSearchbar.tsx";

export default function App() {
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        fetchBooks();
    }, []);
    const fetchBooks = () => {
       axios.get('/api/books')
           .then(response => {
               setBooks(response.data);
           })
           .catch(error => {
               console.error('Error fetching Books: ', error);
               console.error('Error Details: ', error.response);
           });
    }
  return (
      <>
          <NewBookSearchbar />
          <Routes>
                <Route path={"/"} element={<BookOverview books={books} fetchBooks={fetchBooks}/>}/>
                <Route path={"/books/:id"} element={<BookDetailPage />}/>
          </Routes>


      </>

  )
}
