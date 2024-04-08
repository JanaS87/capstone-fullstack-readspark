import NewBookSearchbar from "./NewBookSearchbar.tsx";
import BarcodeScanner from "./BarcodeScanner.tsx";
import {Html5QrcodeResult} from "html5-qrcode";
import React, {useState} from "react";
import axios from "axios";
import {GoogleBook} from "../../types/GoogleBook.ts";
import {Alert, Snackbar} from "@mui/material";
import {BookDto} from "../../types/BookDto.ts";
import BookDetails from "../BookDetails/BookDetails.tsx";
import BookCheckboxes from "../BookCheckboxes/BookCheckboxes.tsx";

type AddNewBookPageProps = {
    isRead: boolean,
    isFavorite: boolean,
    setIsRead: React.Dispatch<React.SetStateAction<boolean>>,
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>,
    convertToBookDto: (googleBook: GoogleBook, isFavorite:boolean, isRead:boolean) => BookDto,
    fetchDbBooks: () => Promise<BookDto[]>,
}


export default function AddNewBookPage({isFavorite, isRead, convertToBookDto, fetchDbBooks, setIsRead, setIsFavorite}: Readonly<AddNewBookPageProps>) {
    const [isScannerActive, setIsScannerActive] = useState(false)
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [alert, setAlert] = useState<string>("");

    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const onNewScanResult = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
        console.log(`Scan result:`, decodedText)
        console.log(`Scan result:`, decodedResult)
        await fetchBookByIsbn(decodedText);
        setIsScannerActive(false);

    };



    async function fetchBookByIsbn(isbn: string) {
        await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
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
            });

    }

        async function handleAddSearchedBook(isbn: string) {
            const book = await fetchBookByIsbn(isbn);
        console.log(book);
        if(selectedBook) {
                const fetchedDbBooks = await fetchDbBooks();
                const bookExists = fetchedDbBooks.find((dbBook) =>
                dbBook.isbn === selectedBook.volumeInfo.industryIdentifiers[0].identifier ||
            dbBook.title === selectedBook.volumeInfo.title ||
                    dbBook.author === selectedBook.volumeInfo.authors.join(", "));
                if (bookExists) {
                    setAlert('Buch bereits vorhanden!');
                    return;
                }
                const bookDto = convertToBookDto(selectedBook, isFavorite, isRead);
                axios.post('/api/books', bookDto)
                    .then(response => {
                        setBooks(prevBooks => [...prevBooks, response.data]);
                        console.log('Book added: ', books);
                        setOpenSnackbar(true);
                        setSelectedBook(null);
                        fetchDbBooks();
                    })
                    .catch(error => {
                        console.error('Error adding book: ', error);
                    });
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
                <NewBookSearchbar
                    convertToBookDto={convertToBookDto}
                    fetchDbBooks={fetchDbBooks}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                isRead={isRead}
                setIsRead={setIsRead}/>
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
                        <BookCheckboxes isRead={isRead} setIsRead={setIsRead} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
                        <div className={"btn-wrapper"}>
                            <button className={"btn-primary"} aria-label={"add"}
                                    onClick={() => handleAddSearchedBook(selectedBook.volumeInfo.industryIdentifiers[0].identifier)}>Buch
                                hinzufügen
                            </button>
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