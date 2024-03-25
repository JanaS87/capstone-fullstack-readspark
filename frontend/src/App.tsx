import {useEffect, useState} from "react";
import Layout from "./components/layout/Layout.tsx";
import {Book} from "./types/Book.ts";
import BookOverview from "./components/BookOverview/BookOverview.tsx";
import axios from "axios";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";

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
          <Router>
          <Routes>
                <Route path={"/"} element={<BookOverview books={books} fetchBooks={fetchBooks}/>}/>
                <Route path={"/books/:id"} element={<BookDetailPage />}/>
          </Routes>

      <Layout />
          </Router>
  )
}
