import axios from 'axios';
import {ChangeEvent, useEffect, useState} from "react";
import {Autocomplete, CircularProgress, TextField, Typography} from "@mui/material";

interface VolumeInfo {
    title: string,
    authors: string[],
}

interface GoogleBook {
    volumeInfo: VolumeInfo
}

export default function NewBookSearchbar() {
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<GoogleBook[]>([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;

        if(!loading) {
            return undefined;
        }
        fetchBooks().then((r) => {
            if(active) {
                setOptions(r)
            }

        });
        return () => {
            active = false;
        }
    }, [loading]);

    useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open]);


  async  function fetchBooks(){
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
                onChange={(event, newValue) => {
                    setSelectedBook(newValue)
                }}
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
                    <Typography>Title: {selectedBook.volumeInfo.title}</Typography>
                    <Typography>Authors: {selectedBook.volumeInfo.authors.join(", ")}</Typography>
                </div>
            )}
        </>
    )
}