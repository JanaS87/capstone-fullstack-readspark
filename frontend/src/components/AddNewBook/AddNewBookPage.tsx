import NewBookSearchbar from "./NewBookSearchbar.tsx";
import Navbar from "../navbar/Navbar.tsx";


export default function AddNewBookPage() {
    return (
        <>
        <div>
            <h1>Neues Buch hinzufügen</h1>
        </div>
            <NewBookSearchbar />
            <Navbar/>
        </>
    )
}