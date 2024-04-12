package org.schmaelzle.backend.service;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;


import org.schmaelzle.backend.google.GoogleBook;
import org.schmaelzle.backend.google.GoogleBookService;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.repository.AppUserRepository;


class AppUserServiceTest {

     private final AppUserRepository repo = mock(AppUserRepository.class);
     private final GoogleBookService googleBookService = mock(GoogleBookService.class);
     private final AppUserService userAppService = new AppUserService(repo, googleBookService);

        @Test
        void testGetLoggedInUser() {
            // given
            String id = "1";
            when(repo.findById(id)).thenReturn(Optional.of(new AppUser()));
            // when
            AppUser result = userAppService.getLoggedInUser(id);
            // then
            verify(repo).findById(id);
            assertEquals(new AppUser(), result);
        }

        @Test
        void testGetLoggedInUserNotFound() {
            // given
            String id = "1";
            when(repo.findById(id)).thenReturn(Optional.empty());
            // when
            NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> userAppService.getLoggedInUser(id));
            // then
            verify(repo).findById(id);
            assertEquals("User not found", exception.getMessage());
        }

        @Test
        void getAppUserById() {
            // given
            String id = "1";
            when(repo.findById(id)).thenReturn(Optional.of(new AppUser()));
            // when
            AppUser result = userAppService.getAppUserById(id);
            // then
            verify(repo).findById(id);
            assertEquals(new AppUser(), result);
        }

        @Test
        void getAppUserByIdNotFound() {
            // given
            String id = "1";
            when(repo.findById(id)).thenReturn(Optional.empty());
            // when
            NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> userAppService.getAppUserById(id));
            // then
            verify(repo).findById(id);
            assertEquals("User not found", exception.getMessage());
        }

    @Test
    void testAddBookToUserFavorites() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setFavoriteBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(repo.save(any(AppUser.class))).thenReturn(user);
        // when
        AppUser result = userAppService.addBookToUserFavorites(userId, bookId);
        // then
        verify(repo).findById(userId);
        verify(repo).save(user);
        assertEquals(List.of(bookId), result.getFavoriteBookIds());
    }

        @Test
        void testAddBookToUserFavoritesAlreadyInFavorites() {
            // given
            String userId = "1";
            String bookId = "2";
            AppUser user = new AppUser();
            user.setFavoriteBookIds(List.of(bookId));
            when(repo.findById(userId)).thenReturn(Optional.of(user));
            // when
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> userAppService.addBookToUserFavorites(userId, bookId));
            // then
            verify(repo).findById(userId);
            assertEquals("Book already in user's favorites", exception.getMessage());
        }

        @Test
        void testRemoveBookFromUserFavorites() {
            // given
            String userId = "1";
            String bookId = "2";
            AppUser user = new AppUser();
            user.setFavoriteBookIds(new ArrayList<>(List.of(bookId)));
            when(repo.findById(userId)).thenReturn(Optional.of(user));
            when(repo.save(any(AppUser.class))).thenReturn(user);
            // when
            AppUser result = userAppService.removeBookFromUserFavorites(userId, bookId);
            // then
            verify(repo).findById(userId);
            verify(repo).save(user);
            assertEquals(List.of(), result.getFavoriteBookIds());
        }

        @Test
        void testRemoveBookFromUserFavoritesNotFound() {
            // given
            String userId = "1";
            String bookId = "2";
            AppUser user = new AppUser();
            user.setFavoriteBookIds(new ArrayList<>());
            when(repo.findById(userId)).thenReturn(Optional.of(user));
            // when
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> userAppService.removeBookFromUserFavorites(userId, bookId));
            // then
            verify(repo).findById(userId);
            assertEquals("Book not exist", exception.getMessage());
        }

    @Test
    void testGetFavoriteBooks() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setFavoriteBookIds(new ArrayList<>(List.of("2")));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(googleBookService.getById("2")).thenReturn(new GoogleBook("2", null));
        // when
        List<GoogleBook> result = userAppService.getFavoriteBooks(userId);
        // then
        verify(repo).findById(userId);
        verify(googleBookService).getById("2");
        assertEquals(List.of(new GoogleBook("2", null)), result);
    }

    @Test
    void testGetFavoriteBooksNotFound() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setFavoriteBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        List<GoogleBook> result = userAppService.getFavoriteBooks(userId);
        // then
        verify(repo).findById(userId);
        assertEquals(List.of(), result);
    }

    @Test
    void testGetBooks() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setBookIds(new ArrayList<>(List.of("2")));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(googleBookService.getById("2")).thenReturn(new GoogleBook("2", null));
        // when
        List<GoogleBook> result = userAppService.getBooks(userId);
        // then
        verify(repo).findById(userId);
        verify(googleBookService).getById("2");
        assertEquals(List.of(new GoogleBook("2", null)), result);
    }

    @Test
    void testGetBooksNotFound() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        List<GoogleBook> result = userAppService.getBooks(userId);
        // then
        verify(repo).findById(userId);
        assertEquals(List.of(), result);
    }

    @Test
    void testGetReadBooks() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setReadBookIds(new ArrayList<>(List.of("2")));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(googleBookService.getById("2")).thenReturn(new GoogleBook("2", null));
        // when
        List<GoogleBook> result = userAppService.getReadBooks(userId);
        // then
        verify(repo).findById(userId);
        verify(googleBookService).getById("2");
        assertEquals(List.of(new GoogleBook("2", null)), result);
    }

    @Test
    void testGetReadBooksNotFound() {
        // given
        String userId = "1";
        AppUser user = new AppUser();
        user.setReadBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        List<GoogleBook> result = userAppService.getReadBooks(userId);
        // then
        verify(repo).findById(userId);
        assertEquals(List.of(), result);
    }

    @Test
    void testAddBookToUserBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(repo.save(any(AppUser.class))).thenReturn(user);
        // when
        AppUser result = userAppService.addBookToUserBooks(userId, bookId);
        // then
        verify(repo).findById(userId);
        verify(repo).save(user);
        assertEquals(List.of(bookId), result.getBookIds());
    }

    @Test
    void testAddBookToUserBooksAlreadyInBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setBookIds(List.of(bookId));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> userAppService.addBookToUserBooks(userId, bookId));
        // then
        verify(repo).findById(userId);
        assertEquals("Book already in user's books", exception.getMessage());
    }

    @Test
    void testAddBookToUserReadBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setReadBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(repo.save(any(AppUser.class))).thenReturn(user);
        // when
        AppUser result = userAppService.addBookToUserReadBooks(userId, bookId);
        // then
        verify(repo).findById(userId);
        verify(repo).save(user);
        assertEquals(List.of(bookId), result.getReadBookIds());
    }

    @Test
    void testAddBookToUserReadBooksAlreadyInReadBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setReadBookIds(List.of(bookId));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> userAppService.addBookToUserReadBooks(userId, bookId));
        // then
        verify(repo).findById(userId);
        assertEquals("Book already in user's read books", exception.getMessage());
    }

    @Test
    void testRemoveBookFromUserBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setBookIds(new ArrayList<>(List.of(bookId)));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(repo.save(any(AppUser.class))).thenReturn(user);
        // when
        AppUser result = userAppService.removeBookFromUserBooks(userId, bookId);
        // then
        verify(repo).findById(userId);
        verify(repo).save(user);
        assertEquals(List.of(), result.getBookIds());
    }

    @Test
    void testRemoveBookFromUserBooksNotFound() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setBookIds(new ArrayList<>());
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        // when
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> userAppService.removeBookFromUserBooks(userId, bookId));
        // then
        verify(repo).findById(userId);
        assertEquals("Book not exist", exception.getMessage());
    }

    @Test
    void testRemoveBookFromUserReadBooks() {
        // given
        String userId = "1";
        String bookId = "2";
        AppUser user = new AppUser();
        user.setReadBookIds(new ArrayList<>(List.of(bookId)));
        when(repo.findById(userId)).thenReturn(Optional.of(user));
        when(repo.save(any(AppUser.class))).thenReturn(user);
        // when
        AppUser result = userAppService.removeBookFromUserReadBooks(userId, bookId);
        // then
        verify(repo).findById(userId);
        verify(repo).save(user);
        assertEquals(List.of(), result.getReadBookIds());
    }
}
