package org.schmaelzle.backend.service;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.Book;
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
}
