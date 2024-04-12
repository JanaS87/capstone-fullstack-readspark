import BookOverview from "./components/BookOverview/BookOverview.tsx";
import {Route, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import useAppUser from "./utils/useAppUser.ts";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import FavoriteBooksPage from "./components/FavoritesPage/FavoriteBooksPage.tsx";
import AddNewBookPage from "./components/AddNewBook/AddNewBookPage.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes.tsx";
import ReadBookPage from "./components/ReadBookPage/ReadBookPage.tsx";

export default function App() {
    const {
        appUser,
        login,
        books,
        addBook,
        removeBook,
        addReadBook,
        removeReadBook,
        addFavorite,
        removeFavorite
    } = useAppUser();

    return (
        <>
            <Routes>
                <Route path={"/login"} element={<LoginPage login={login}/>}/>
                <Route element={<ProtectedRoutes user={appUser}/>}>
                    <Route
                        path={"/"}
                        element={
                            <BookOverview
                                books={books}
                                // @ts-expect-error appUser can´t be null or undefined here, it is checked in ProtectedRoutes
                                appUser={appUser}
                            />
                        }
                    />
                    <Route
                        path={"/add"}
                        element={
                            <AddNewBookPage
                                addBook={addBook}/>
                        }
                    />
                    <Route
                        path={"/books/:id"}
                        element={
                            <BookDetailPage
                                // @ts-expect-error appUser can´t be null or undefined here, it is checked in ProtectedRoutes
                                appUser={appUser}
                                addReadBook={addReadBook}
                                removeReadBook={removeReadBook}
                                removeBook={removeBook}
                                addFavoriteBook={addFavorite}
                                removeFavoriteBook={removeFavorite}
                            />
                        }
                    />
                    <Route
                        path={"/favorites"}
                        element={
                            <FavoriteBooksPage
                                // @ts-expect-error appUser can´t be null or undefined here, it is checked in ProtectedRoutes
                                appUser={appUser}
                                books={books}
                            />
                        }
                    />
                    <Route
                        path={"/read"}
                        element={
                            <ReadBookPage
                                // @ts-expect-error appUser can´t be null or undefined here, it is checked in ProtectedRoutes
                                appUser={appUser}
                                books={books}
                            />
                        }
                    />
                </Route>

            </Routes>
            <Navbar/>
        </>
    )
}
