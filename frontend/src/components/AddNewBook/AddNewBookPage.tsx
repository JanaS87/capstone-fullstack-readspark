import NewBookSearchbar from "./NewBookSearchbar.tsx";


export default function AddNewBookPage() {
    return (
        <>
        <div className={"header-title--wrapper"}>
            <h1 className={"header-title"}>Neues Buch hinzufügen</h1>
        </div>
            <NewBookSearchbar  />
        </>
    )
}