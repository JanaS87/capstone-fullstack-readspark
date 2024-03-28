import axios from 'axios';
import React, {ChangeEvent, useEffect, useState} from "react";
import {Alert, Autocomplete, Button, CircularProgress, Snackbar, TextField, Typography} from "@mui/material";
import {IndustryIdentifier} from "../../types/IndustryIdentifier.ts";

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

interface VolumeInfo {
    title: string,
    authors: string[],
    publisher: string,
    categories: string[],
    industryIdentifiers: IndustryIdentifier[]
}

interface ImageLink {
    smallThumbnail: string,
    Thumbnail: string
}

interface SearchInfo {
    textSnippet: string
}

interface GoogleBook {
    id: string,
    volumeInfo: VolumeInfo,
    imageLinks: ImageLink,
    searchInfo: SearchInfo
}

async  function fetchBooks(searchTerm: string){
    if(searchTerm) {
        return  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${import.meta.env.VITE_REACT_APP_GOOGLE_BOOKS_API_KEY}`)
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
    const loading = open && options.length === 0;



    useEffect(() => {
        let active = true;

        if(!loading) {
            return undefined;
        }
        fetchBooks(searchTerm).then((r) => {
            if(active) {
                setOptions(r)
            }

        });
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
            favorite: false,
            read: false,
            blurb: googleBook.searchInfo.textSnippet || ""
        }
    }


    function handleAddNewBook() {
        if (selectedBook) {
            const bookDto = convertToBookDto(selectedBook);
            console.log("Book: ", bookDto)
            axios.post('/api/books', bookDto)
                .then(response => {
                    console.log('Book added: ', response.data);
                    setBooks(prevBooks => [...prevBooks, response.data]);
                    setOpenSnackbar(true);
                    setSelectedBook(null);
                    setSearchTerm("");
                    console.log("Book added: ", books);
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
                   <li key={option.id} {...props}>
                       <img src={option.imageLinks?.smallThumbnail} alt={option.volumeInfo.title} style={{width: 50, height: 50}}/>
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
                    <img src={selectedBook.imageLinks?.Thumbnail} alt={selectedBook.volumeInfo.title}/>
                    <Typography>Titel: {selectedBook.volumeInfo.title}</Typography>
                    <Typography>Author: {selectedBook.volumeInfo.authors.join(", ")}</Typography>
                    <Typography>Publisher: {selectedBook.volumeInfo.publisher}</Typography>
                    <Typography>Categories: {selectedBook.volumeInfo.categories.join(", ")}</Typography>
                    <Typography>Search Info: {selectedBook.searchInfo.textSnippet}</Typography>
                    <Button variant={"contained"} color={"primary"} onClick={handleAddNewBook}>Buch hinzufügen</Button>
                </div>
            )}
            <Snackbar open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={handleCloseSnackbar}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Buch erfolgreich hinzugefügt!
                </Alert>
            </Snackbar>
        </>
    )
}