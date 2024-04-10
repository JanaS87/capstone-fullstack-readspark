import BookOverview from "./components/BookOverview/BookOverview.tsx";
import {Route, Routes} from "react-router-dom";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import AddNewBookPage from "./components/AddNewBook/AddNewBookPage.tsx";
import useAppUser from "./utils/useAppUser.ts";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes.tsx";


export default function App() {
    const {appUser, login, books, addBook,} = useAppUser();


  return (
      <>
          {appUser ? <h1>Welcome back, {appUser.username}</h1> : <h1>Not logged in</h1>}
          <Routes>
              <Route path={"/login"} element={<LoginPage login={login}/>}/>
              <Route element={<ProtectedRoutes user={appUser}/>}>
                <Route path={"/"} element={<BookOverview
                    books={books}
                />}
                />
                <Route path={"/books/:id"} element={<BookDetailPage />}/>
                <Route path={"/add"} element={<AddNewBookPage addBook={addBook}/>}/>
                {/*<Route path={"/favorites"} element={<FavoriteBooksPage
                    favorites={favorites}
                    fetchFavoriteBooks={fetchFavoriteBooks}
                />}
                />*/}
              </Route>
          </Routes>
          <Navbar/>
      </>

  )
}
