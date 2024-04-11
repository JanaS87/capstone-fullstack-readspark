import {AppUser} from "../types/AppUser.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {GoogleBook} from "../types/GoogleBook.ts";

export default function useAppUser() {
    const [appUser, setAppUser] = useState<AppUser | null | undefined>(undefined);
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [readBooks, setReadBooks] = useState<GoogleBook[]>([]);
    const [favoriteBooks, setFavoriteBooks] = useState<GoogleBook[]>([]);

    function fetchMe() {
        axios.get("/api/users/me")
            .then(response => setAppUser(response.data))
            .catch(() => setAppUser(null));
    }

    useEffect(() => {
        fetchMe();
        fetchBooks();
        fetchFavorites();
        fetchReadBooks();
    }, []);

    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    function logout() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin
        setAppUser(null)

        window.open(host + '/logout', '_self')
    }

    function fetchBooks() {
        axios.get("/api/users/books")
            .then(response => {
                console.log(response)
                setBooks(response.data)
            })
            .catch(() => setBooks([]));
    }

    function addBook(id: string) {
        axios.post(`/api/users/books/${id}`)
            .then(() => {
                fetchBooks();
                fetchMe();
            });

    }

    function removeBook(id: string) {
        axios.delete(`/api/users/books/${id}`)
            .then(() => {
                fetchBooks();
                fetchMe();
            });
    }

    function fetchFavorites() {
        axios.get("/api/users/books/favorites")
            .then(response => setFavoriteBooks(response.data.items))
            .catch(() => setFavoriteBooks([]));
    }

    function addFavorite(id: string) {
        axios.post(`/api/users/books/favorites/${id}`)
            .then(() => {
                fetchFavorites();
                fetchMe();
            });
    }

    function removeFavorite(id: string) {
        axios.delete(`/api/users/books/favorites/${id}`)
            .then(() => {
                fetchFavorites();
                fetchMe();
            });
    }

    function fetchReadBooks() {
        axios.get("/api/users/books/read")
            .then(response => setReadBooks(response.data.items))
            .catch(() => setReadBooks([]));
    }

    function addReadBook(id: string) {
        axios.post(`/api/users/books/read/${id}`)
            .then(() => {
                fetchReadBooks();
                fetchMe();
            });
    }

    function removeReadBook(id: string) {
        axios.delete(`/api/users/books/read/${id}`)
            .then(() => {
                fetchReadBooks();
                fetchMe();
            });
    }

    return {
        appUser,
        login,
        logout,
        addReadBook,
        addFavorite,
        addBook,
        removeReadBook,
        removeFavorite,
        removeBook,
        favoriteBooks,
        readBooks,
        books,
        fetchBooks,
    }
}