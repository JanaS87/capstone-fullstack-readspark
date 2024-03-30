import axios from 'axios';
import React, {ChangeEvent, useEffect, useState} from "react";
import {Alert, Autocomplete, Button, CircularProgress, Snackbar, TextField, Typography} from "@mui/material";
import {GoogleBook} from "../../types/GoogleBook";
import Checkboxes from "../Checkboxes/Checkboxes.tsx";


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

export default function NewBookSearchbar() {
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<GoogleBook[]>([]);
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [timer, setTimer] = useState<number>();
    const [alert, setAlert] = useState<string>("");
    const [dbBooks, setDbBooks] = useState<BookDto[]>([]);
    const [isRead, setIsRead] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
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


    function convertToBookDto(googleBook: GoogleBook) : BookDto{
        return {
            title: googleBook.volumeInfo.title || "",
            author: googleBook.volumeInfo.authors ? googleBook.volumeInfo.authors.join(", ") : "",
            genre: googleBook.volumeInfo.categories ? googleBook.volumeInfo.categories.join(", ") : "",
            publisher: googleBook.volumeInfo.publisher || "",
            isbn: googleBook.volumeInfo.industryIdentifiers ? googleBook.volumeInfo.industryIdentifiers[0].identifier : "",
            favorite: isFavorite,
            read: isRead,
            blurb: googleBook.volumeInfo.description || ""
        }
    }

   async function fetchDbBooks(): Promise<BookDto[]> {
       await axios.get('/api/books')
            .then(response => {
                setDbBooks(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching Books: ', error);
                console.error('Error Details: ', error.response);
            });
       return [];
    }

   async function handleAddNewBook() {
        if (selectedBook) {
            await fetchDbBooks();
            const bookExists = dbBooks.find(book => book.isbn === selectedBook.volumeInfo.industryIdentifiers[0].identifier);
            if (bookExists) {
                setAlert('Buch bereits vorhanden!');
                return;
            }
            const bookDto = convertToBookDto(selectedBook);
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
                <div>
                    <Typography variant={"h6"}>Selected Book:</Typography>
                    <img src={selectedBook.volumeInfo.imageLinks?.thumbnail} alt={selectedBook.volumeInfo.title}/>
                    <Typography>Titel: {selectedBook.volumeInfo.title}</Typography>
                    <Typography>Author: {selectedBook.volumeInfo.authors.join(", ")}</Typography>
                    <Typography>Publisher: {selectedBook.volumeInfo.publisher}</Typography>
                    <Typography>Categories: {selectedBook.volumeInfo.categories.join(", ")}</Typography>
                    <Typography>Search Info: {selectedBook.volumeInfo.description}</Typography>
                    <Button variant={"contained"} color={"primary"} onClick={handleAddNewBook}>Buch hinzufügen</Button>
                    <div>
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
                </div>
            )}

            <Snackbar open={openSnackbar}
                      autoHideDuration={3000}
                      onClose={handleCloseSnackbar}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
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