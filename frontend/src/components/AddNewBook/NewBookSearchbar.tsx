import axios from 'axios';
import React, {ChangeEvent, useEffect, useState} from "react";
import {Alert, Autocomplete, Button, CircularProgress, Snackbar, TextField} from "@mui/material";
import {GoogleBook} from "../../types/GoogleBook";
import Checkboxes from "../Checkboxes/Checkboxes.tsx";
import "./NewBookSearchbar.css";

type NewBookSearchbarProps = {
    convertToBookDto: (googleBook: GoogleBook, isFavorite:boolean, isRead:boolean, ) => BookDto,
    fetchDbBooks: () => Promise<BookDto[]>,
    isFavorite: boolean,
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>,
    isRead: boolean,
    setIsRead: React.Dispatch<React.SetStateAction<boolean>>,
}


interface BookDto {
    title: string,
    author: string,
    genre: string,
    publisher: string,
    isbn: string,
    favorite: boolean,
    read: boolean,
    blurb: string,
}

async  function fetchSearchedBooks(searchTerm: string){
    if(searchTerm) {
        return  axios.get(`/api/google/books?q=${searchTerm}`)
            .then(response => {
                return response.data.items || [];
            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
            });
    }
    return [];
}

export default function NewBookSearchbar({convertToBookDto, fetchDbBooks, isFavorite, setIsFavorite, isRead, setIsRead}: Readonly<NewBookSearchbarProps>) {
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<GoogleBook[]>([]);
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [timer, setTimer] = useState<number>();
    const [alert, setAlert] = useState<string>("");
    const [dbBooks, setDbBooks] = useState<BookDto[]>([]);
    const loading = open && options.length === 0;



    useEffect(() => {
        let active = true;
        clearTimeout(timer)
       const timeout = window.setTimeout(() => {
           fetchSearchedBooks(searchTerm).then((r) => {
                if(active) {
                    setOptions(r)
                }
            });

        }, 1000);

        setTimer(timeout);
        return () => {
            active = false;
        }
    }, [loading, searchTerm]);

    useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open]);

    fetchDbBooks().then(r => setDbBooks(r));

   async function handleAddNewBook() {
        if (selectedBook) {
            await fetchDbBooks();
            const bookExists = dbBooks.find(book => book.isbn === selectedBook.volumeInfo.industryIdentifiers[0].identifier);
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
                    setSearchTerm("");
                    fetchDbBooks();
                })
                .catch(error => {
                    console.error('Error adding book: ', error);
                });
        }
    }

    function handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }


    return (
        <>
           <Autocomplete
               open={open}
                onOpen={() => {
                     setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option?.volumeInfo.title === value?.volumeInfo.title}
               getOptionLabel={(option) => option.volumeInfo.title}
                options={options}
                loading={loading}
                onChange={(_, newValue) => {
                    setSelectedBook(newValue)
                }}
               renderOption = {(props, option) => (
                   <li {...props} key={option.volumeInfo.industryIdentifiers[0].identifier} >
                       <img src={option.volumeInfo.imageLinks?.smallThumbnail} alt={option.volumeInfo.title} style={{width: 50, height: 50}}/>
                          {option.volumeInfo.title}
                     </li>
               )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search for a book"
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setSearchTerm(e.target.value)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color={"inherit"} size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}

                    />
                )}

           />
            {selectedBook && (
                <div className={"selected-book-wrapper"}>
                    <img className={"book-img"} src={selectedBook.volumeInfo.imageLinks?.thumbnail}
                         alt={selectedBook.volumeInfo.title}/>
                    <div className={"information-wrapper"}>
                        <p className={"information-title"}><span>Titel:</span> {selectedBook.volumeInfo.title}</p>
                        <p className={"information-author"}><span>Autor:</span> {selectedBook.volumeInfo.authors.join(", ")}</p>
                        <p className={"information-publisher"}><span>Verlag:</span> {selectedBook.volumeInfo.publisher}</p>
                        <p className={"information-category"}><span>Genre:</span> {selectedBook.volumeInfo.categories.join(", ")}</p>
                        <p className={"description-text"}>
                            <span>Beschreibung:</span> {selectedBook.volumeInfo.description}
                        </p>
                    </div>
                    <div className={"checkbox-wrapper"}>
                        <Checkboxes
                            checked={isRead}
                            onChange={(e) => setIsRead(e.target.checked)}
                            label={"Gelesen"}
                        />
                        <Checkboxes
                            checked={isFavorite}
                            onChange={(e) => setIsFavorite(e.target.checked)}
                            label={"Favorit"}
                        />
                    </div>
                    <Button className={"btn-primary"} aria-label={"add"} variant={"contained"} style={{backgroundColor: "#423F3E", color: "white"}}
                            onClick={handleAddNewBook}>Buch hinzufügen</Button>

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