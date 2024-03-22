package org.schmaelzle.backend.service;

import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.repository.BookRepository;
import org.springframework.data.mongodb.core.MongoOperations;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BookServiceTest {

     private final BookRepository repo = mock(BookRepository.class);
     private final BookService service = new BookService(repo);

     @Test
    void getAllBooks_whenCalledInitially_ThenReturnEmptyList() {
        //Given
        List<Book> expected = new ArrayList<>();
        when(repo.findAll()).thenReturn(new ArrayList<>());
        //When
        List<Book> actual = service.getAllBooks();
        //Then
        assertEquals(expected, actual);
        verify(repo).findAll();
    }

    @Test
    void getBookById_whenCalledWithValidId_thenReturnBookWithId() {
         //GIVEN
        Book expected = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy", "3-551-55167-7", "Carlson", false,
        false, "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen." );
        when(repo.findById("1")).thenReturn(java.util.Optional.of(expected));

        //WHEN
        Book actual = service.getBookById("1");

        //THEN
        verify(repo).findById("1");
        assertEquals(expected, actual);
    }

    @Test
    void getBookById_whenCalledWithInvalidId_thenThrowNoSuchElementException(){
        assertThrows(NoSuchElementException.class, () -> service.getBookById("123"));
    }


}
