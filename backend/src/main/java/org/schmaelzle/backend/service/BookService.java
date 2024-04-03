package org.schmaelzle.backend.service;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.model.BookDto;
import org.schmaelzle.backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository repo;

    public List<Book> getAllBooks() {
        return repo.findAll();
    }


    public Book getBookById(String id) {
        return repo.findById(id).orElseThrow(() -> new NoSuchElementException("Element with Id: " + id +" not found"));
    }

    public Book addBook(BookDto book) {
        Book newBook = new Book(null, book.title(), book.author(), book.genre(), book.publisher(), book.isbn(), book.favorite(), book.read(), book.blurb());
        return repo.save(newBook);
    }

    public List<Book> getFavoriteBooks() {
        return repo.findByFavoriteTrue();
    }

    public Book updateBook(String id, BookDto book) {
        Book existingBook =  repo.findById(id).orElseThrow(() -> new NoSuchElementException("Element with Id: " + id +" not found"));
        existingBook.setFavorite(book.favorite());
        existingBook.setRead(book.read());
        return repo.save(existingBook);
    }
}
