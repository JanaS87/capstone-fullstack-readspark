import axios from 'axios';
import React, {ChangeEvent, useEffect, useState} from "react";
import {Alert, Autocomplete, Button, CircularProgress, Snackbar, TextField} from "@mui/material";
import {GoogleBook} from "../../types/GoogleBook";
import "./NewBookSearchbar.css";
import BookDetails from "../BookDetails/BookDetails.tsx";
import {useNavigate} from "react-router-dom";

type NewBookSearchbarProps = {
    addBook: (id: string) => void;
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

export default function NewBookSearchbar(props: Readonly<NewBookSearchbarProps>) {
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<GoogleBook[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [timer, setTimer] = useState<number>();
    const [alert, setAlert] = useState<string>("");
    const loading = open && options.length === 0;
    const navigate = useNavigate()



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
        // eslint-disable-next-line
    }, [loading, searchTerm]);

    useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open]);


 function handleAddNewBook() {
        if (selectedBook) {
            props.addBook(selectedBook.id);
            setSelectedBook(null);
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
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
                <><BookDetails
                    selectedBook={selectedBook}
                />
                    <Button
                    className={"btn-primary"} aria-label={"add"} variant={"contained"}
                    style={{backgroundColor: "#423F3E", color: "white"}}
                    onClick={handleAddNewBook}>Buch hinzufügen</Button>
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