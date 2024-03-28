import NewBookSearchbar from "./AddNewBook/NewBookSearchbar.tsx";
import Navbar from "./navbar/Navbar.tsx";


export default function AddNewBookPage() {
    return (
        <>
        <div>
            <h1>Add New Book</h1>
        </div>
            <NewBookSearchbar />
            <Navbar/>
        </>
    )
}