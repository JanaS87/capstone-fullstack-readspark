import axios from 'axios';
import {ChangeEvent, useEffect, useState} from "react";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";


export default function NewBookSearchbar() {
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [read, setRead] = useState(false)
    const [favorite, setFavorite] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const loading = open && books.length === 0;

    useEffect(() => {
        let active = true;
        if(!loading) {
            return undefined;
        }
        fetchBooks().then((r) => {
            if(active) {
                setBooks(r)
            }

        });
        return () => {
            active = false;
        }
    }, [loading]);

    useEffect(() => {
        if(!open) {
            setBooks([]);
        }
    }, [open]);



  async  function fetchBooks(){
        if(searchTerm) {
          return  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${import.meta.env.VITE_REACT_APP_GOOGLE_BOOKS_API_KEY}`)
                .then(response => {
                    console.log(response)
                    return response.data.items;
                })
                .catch(error => {
                    console.error('Error fetching Books: ', error);
                });
            console.log(books)
        }
    }

    return (
           <Autocomplete
               open={open}
                onOpen={() => {
                     setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option.volumeInfo.title === value.title}
               getOptionLabel={(option) => option.volumeInfo.title}
                options={books}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search for a book"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color={"inherit"} size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}

                    />
                )}

           />

    )
}