package org.schmaelzle.backend.controller;


import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
 class BookControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private BookRepository repo;

    @Test
    void getAllBooks_whenCalledInitially_thenReturnEmptyList() throws Exception {
        //GIVEN
        //WHEN&THEN
        mvc.perform(MockMvcRequestBuilders.get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getBookById_whenCalledWithValidId_thenReturnNoSuchElementException() throws Exception {
        //GIVEN
        Book book = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy", "3-551-55167-7", "Carlson",false,
                false, "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");
        repo.save(book);
        //WHEN&THEN
        mvc.perform(MockMvcRequestBuilders.get("/api/books/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "1",
                            "title": "Harry Potter",
                            "author": "J.K. Rowling",
                            "genre": "Fantasy",
                            "isbn": "3-551-55167-7",
                            "publisher": "Carlson",
                            "favorite": false,
                            "read": false,
                            "blurb": "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen."
                        }
                        """));

    }

    @Test
    void getBookById_whenCalledWithInvalidId_thenReturnNoSuchElementException() throws Exception {
        //GIVEN
        //WHEN&THEN
        mvc.perform(MockMvcRequestBuilders.get("/api/books/123"))
                .andExpect(status().isNotFound());
    }
}
