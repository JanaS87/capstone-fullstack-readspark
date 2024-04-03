package org.schmaelzle.backend.controller;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.model.BookDto;
import org.schmaelzle.backend.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService service;

    @GetMapping
    public List<Book> getAllBooks() {
        return service.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable String id){
        return service.getBookById(id);
    }

    @PostMapping
    public Book addBook(@RequestBody BookDto book) {
        return service.addBook(book);
    }

    @GetMapping("/favorites")
    public List<Book> getFavoriteBooks() {
        return service.getFavoriteBooks();
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable String id, @RequestBody BookDto book) {
        return service.updateBook(id, book);
    }

    @DeleteMapping("/{id}")
    public void deleteBookById(@PathVariable String id) {
        service.deleteBookById(id);
    }


    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNoSuchElementException(NoSuchElementException e) {
        return e.getMessage();
    }
}
