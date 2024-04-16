import NewBookSearchbar from "./NewBookSearchbar.tsx";
import BarcodeScanner from "./BarcodeScanner.tsx";
import {Html5QrcodeResult} from "html5-qrcode";
import React, {useState} from "react";
import axios from "axios";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {Alert, Button, Snackbar} from "@mui/material";
import BookDetails from "../BookDetails/BookDetails.tsx";
import {useNavigate} from "react-router-dom";
import "./AddNewBookPage.css";

type AddNewBookPageProps = {
    addBook: (id: string) => Promise<void>,
}


export default function AddNewBookPage(props: Readonly<AddNewBookPageProps>) {
    const [isScannerActive, setIsScannerActive] = useState(false)
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [alert, setAlert] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const [addMethod, setAddMethod] = useState<'search' | 'scan' | null>(null)

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
            props.addBook(selectedBook.id)
                .then(r => {
                    setSelectedBook(null);
                    setOpenSnackbar(true);
                    setTimeout(() =>
                        navigate('/'),
                        3000);
                    return r;

                })
                .catch(() => setAlert('Buch gibt es bereits!')
                )
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

        function handleSelectMethod(method: 'search' | 'scan') {
            setAddMethod(method);
        }

        function handleResetMethod() {
            setAddMethod(null);
            setSelectedBook(null);
        }


        return (
            <>
            <div className={"header-title--wrapper"}>
                <h1 className={"header-title"}>Neues Buch</h1>

            </div>
            {addMethod === null && (
                <>
                    <p className={"add-method-paragraph"}>Wie möchtest du ein Buch hinzufügen?</p>
                    <div className={"add-method--wrapper"}>

                        <Button className={"btn-primary"} aria-label={"select method"} variant={"contained"}
                                style={{backgroundColor: "#423F3E", color: "white"}}
                                onClick={() => handleSelectMethod('search')}>Buch suchen</Button>
                        <Button className={"btn-primary"} aria-label={"select method"} variant={"contained"}
                                style={{backgroundColor: "#423F3E", color: "white"}}
                                onClick={() => handleSelectMethod('scan')}>Buch scannen</Button>
                    </div>
                </>
        )
}
{
            addMethod === 'search' && <NewBookSearchbar addBook={props.addBook}/>}
                {addMethod === 'scan' && (
                    <div className={"isbn-method-wrapper"}>
                        <h2>Buch über ISBN suchen</h2>
                        <Button className={"open-scanner-btn"}
                            aria-label={"open scanner"} variant={"contained"}
                                style={{backgroundColor: "#423F3E", color: "white"}}
                                onClick={handleScannerToggle}>
                            {isScannerActive ? "Barcode Scanner stoppen" : "Barcode Scanner starten"}
                        </Button>
                    </div>
                )}

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
                            <Button aria-label={"add book"} style={{backgroundColor: "#423F3E", color: "white"}} onClick={addNewBook}>Buch hinzufügen</Button>
                            <Button style={{backgroundColor: "#423F3E", color: "white"}} className={"btn-secondary"} aria-label={"cancel"} onClick={handleCancel}>Abbrechen
                            </Button>
                        </div>
                    </>
                )}
                {addMethod !== null && (
                    <div className={"reset-btn-wrapper"}>
                    <Button
                            aria-label={"back to methods"} variant={"contained"}
                            style={{backgroundColor: "#423F3E", color: "white"}}
                            onClick={handleResetMethod}
                    >
                        Zur Auswahl zurück
                    </Button>
                    </div>
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