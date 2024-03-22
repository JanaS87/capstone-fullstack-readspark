package org.schmaelzle.backend.service;

import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.repository.BookRepository;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
}
