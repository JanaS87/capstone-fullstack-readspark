package org.schmaelzle.backend.service;

import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.model.Book;
import org.schmaelzle.backend.model.BookDto;
import org.schmaelzle.backend.repository.BookRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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
        Book expected = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy","Carlson" , "3-551-55167-7", false,
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

    @Test
    void addBook_whenCalledWithBook_thenReturnBook() {
         // GIVEN
        BookDto book = new BookDto("Harry Potter", "J.K. Rowling", "Fantasy", "Carlson", "3-551-55167-7", false, false,
                "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");
        Book newBook = new Book(null, book.title(), book.author(), book.genre(), book.publisher(), book.isbn(), book.favorite(), book.read(), book.blurb());
        when(repo.save(newBook)).thenReturn(newBook);

        // WHEN
        Book actual = service.addBook(book);

        //THEN
        verify(repo).save(any(Book.class));
        assertEquals(newBook, actual);

    }

    @Test
    void getFavoriteBooks_whenCalled_thenReturnFavoriteBooks() {
        // GIVEN
        Book book1 = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy","Carlson" , "3-551-55167-7", true,
                false, "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");

        Book book2 = new Book("2", "Der Marsianer", "Andy Weir", "Science Fiction","Carlson" , "3-551-55167-7", true,
                false, "Der Marsianer ist ein Science-Fiction-Roman des US-amerikanischen Schriftstellers Andy Weir. Die Handlung spielt in der nahen Zukunft, in der die NASA eine bemannte Marsmission durchführt. Der Astronaut Mark Watney wird aufgrund eines Unfalls für tot gehalten und von der Crew zurückgelassen. " +
                "Er überlebt jedoch und muss versuchen, auf dem Mars zu überleben, bis eine Rettungsmission eintrifft.");

        List<Book> favoriteBooks = new ArrayList<>();
        favoriteBooks.add(book1);
        favoriteBooks.add(book2);

        when(repo.findByFavoriteTrue()).thenReturn(favoriteBooks);

        // WHEN

        List<Book> actual = service.getFavoriteBooks();

        // THEN
        verify(repo).findByFavoriteTrue();
        assertEquals(favoriteBooks, actual);
    }

    @Test
    void updateBook_whenCalledWithValidId_thenReturnUpdatedBook() {
        // GIVEN
        BookDto book = new BookDto("Harry Potter", "J.K. Rowling", "Fantasy", "Carlson", "3-551-55167-7", true, true,
                "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");
        Book existingBook = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy","Carlson" , "3-551-55167-7", false,
                false, "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");
        when(repo.findById("1")).thenReturn(Optional.of(existingBook));
        when(repo.save(existingBook)).thenReturn(existingBook);

        // WHEN
        Book actual = service.updateBook("1", book);

        // THEN
        verify(repo).findById("1");
        verify(repo).save(existingBook);
        assertEquals(existingBook, actual);
    }

    @Test
    void deleteBookById_whenCalledWithValidId_thenDeleteBook() {
        // GIVEN
        String id = "1";
        Book existingBook = new Book("1", "Harry Potter", "J.K. Rowling", "Fantasy","Carlson" , "3-551-55167-7", false,
                false, "Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – " +
                        "denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, " +
                        "dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.");
        when(repo.findById(id)).thenReturn(Optional.of(existingBook));

        // WHEN
        service.deleteBookById(id);

        // THEN
        verify(repo).delete(existingBook);
    }

    @Test
    void deleteBookById_whenCalledWithInvalidId_thenThrowNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> service.deleteBookById("123"));
    }


}
