import NewBookSearchbar from "./NewBookSearchbar.tsx";
import BarcodeScanner from "./BarcodeScanner.tsx";
import {Html5QrcodeResult} from "html5-qrcode";
import React, {useState} from "react";
import axios from "axios";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {Alert, Snackbar} from "@mui/material";
import BookDetails from "../BookDetails/BookDetails.tsx";

type AddNewBookPageProps = {
    addBook: (id: string) => void,
}


export default function AddNewBookPage(props: Readonly<AddNewBookPageProps>) {
    const [isScannerActive, setIsScannerActive] = useState(false)
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [alert, setAlert] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const onNewScanResult =  (decodedText: string, decodedResult: Html5QrcodeResult) => {
        console.log(`Scan result:`, decodedText)
        console.log(`Scan result:`, decodedResult)
         fetchBookByIsbn(decodedText);
        setIsScannerActive(false);
    };


     function fetchBookByIsbn(isbn: string) {
         axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
            .then(response => {
                if  (response.data.items && response.data.items.length > 0) {
                    setSelectedBook(response.data.items[0]);
                } else {
                    console.error('No book found for ISBN: ', isbn);
                    setAlert('Kein Buch gefunden!');
                }

            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
            })
             .finally(() => handleScannerToggle());

    }

    function addNewBook() {
        if (selectedBook) {
            props.addBook(selectedBook.id);
            setOpenSnackbar(true);
        }
    }

        function handleScannerToggle() {
            setIsScannerActive(!isScannerActive)
        }

        function handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
            if (reason === 'clickaway') {
                return;
            }
            setOpenSnackbar(false);
        }

        function handleCancel() {
            setSelectedBook(null);
        }


        return (
            <>
                <div className={"header-title--wrapper"}>
                    <h1 className={"header-title"}>Neues Buch hinzufügen</h1>
                </div>
                <NewBookSearchbar addBook={props.addBook}/>
                <div>
                    <h2>Buch über ISBN suchen</h2>
                    <button onClick={handleScannerToggle}>
                        {isScannerActive ? "Barcode Scanner stoppen" : "Barcode Scanner starten"}
                    </button>
                </div>
                {isScannerActive && (
                    <BarcodeScanner
                        qrCodeSuccessCallback={onNewScanResult}
                        qrCodeErrorCallback={error => console.error(error)}
                        fps={10}
                        qrbox={250}
                        disableFlip={false}
                    />
                )}
                {selectedBook && (
                    <>
                        <BookDetails selectedBook={selectedBook}/>
                        <div className={"btn-wrapper"}>
                            <button className={"btn-primary"} onClick={addNewBook} aria-label={"add"}>Buch hinzufügen</button>
                            <button className={"btn-secondary"} aria-label={"cancel"} onClick={handleCancel}>Abbrechen
                            </button>
                        </div>
                    </>
                )}
                <Snackbar open={openSnackbar}
                          autoHideDuration={3000}
                          onClose={handleCloseSnackbar}
                          anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%'}}>
                        Buch erfolgreich hinzugefügt!
                    </Alert>
                </Snackbar>
                {alert && (
                    <Alert severity="warning" onClose={() => setAlert("")}>
                        {alert}
                    </Alert>
                )}
            </>
        )
}