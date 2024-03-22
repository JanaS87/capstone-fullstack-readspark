package org.schmaelzle.backend.controller;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.service.BookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService service;

    @GetMapping
    public List<Book> getAllBooks() {
        return service.getAllBooks();
    }
}
