import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useState} from "react";

export default function NewBookSearchbar() {
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [read, setRead] = useState(false)
    const [favorite, setFavorite] = useState(false)



    function fetchBooks(searchTerm: string) {
        if(searchTerm) {
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`)
                .then(response => {
                    setBooks(response.data.items);
                })
                .catch(error => {
                    console.error('Error fetching Books: ', error);
                });
        }
    }

    return (
        <>
            <Autocomplete
                options={books}
                getOptionLabel={(option) => option.volumeInfo.title}
                renderOption={(option) => (
                    <>
                        <img src={option.volumeInfo.imageLinks?.thumbnail} alt={option.volumeInfo.title}/>
                        {option.volumeInfo.title}
                    </>
                )}
                style={{ width: 300 }}
                onInputChange={(event, value) => fetchBooks(value)}
                onChange={(event, value) => setSelectedBook(value)}
                renderInput={(params) => <TextField {...params} label="Search for a book" variant="outlined" />}
                {selectedBook && (
                    <div>
                        <h2>{selectedBook.volumeInfo.title}</h2>


                    </div>
                )}










            ></Autocomplete>
        </>
    )
}

function encodeURIComponent(searchTerm: string) {
    throw new Error('Function not implemented.');
}
