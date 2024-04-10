package org.schmaelzle.backend.service;

import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.google.GoogleBook;
import org.schmaelzle.backend.google.GoogleBookResponse;
import org.schmaelzle.backend.google.GoogleBookService;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    private final GoogleBookService googleBookService;

    public AppUser getLoggedInUser(String id) {
        return getAppUserById(id);
    }

    private AppUser getAppUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public AppUser addBookToUserFavorites(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getFavoriteBookIds().add(bookId);
        return userRepository.save(user);
    }

    public AppUser removeBookFromUserFavorites(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getFavoriteBookIds().remove(bookId);
        return userRepository.save(user);
    }

    public List<GoogleBook> getFavoriteBooks(String userId) {
        AppUser user = getAppUserById(userId);
        List<GoogleBook> favoriteBooks = new ArrayList<>();
        for (String bookId : user.getFavoriteBookIds()) {
            favoriteBooks.add(googleBookService.getById(bookId));
        }
        return favoriteBooks;
    }

    public List<GoogleBook> getBooks(String userId) {
        AppUser user = getAppUserById(userId);
        List<GoogleBook> books = new ArrayList<>();
        for (String bookId : user.getBookIds()) {
            books.add(googleBookService.getById(bookId));
        }
        return books;
    }

    public List<GoogleBook> getReadBooks(String userId) {
        AppUser user = getAppUserById(userId);
        List<GoogleBook> readBooks = new ArrayList<>();
        for (String bookId : user.getReadBookIds()) {
            readBooks.add(googleBookService.getById(bookId));
        }
        return readBooks;
    }

    public AppUser addBookToUserBooks(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getBookIds().add(bookId);
        return userRepository.save(user);
    }

    public AppUser addBookToUserReadBooks(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getReadBookIds().add(bookId);
        return userRepository.save(user);
    }

    public AppUser removeBookFromUserBooks(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getBookIds().remove(bookId);
        return userRepository.save(user);
    }

    public AppUser removeBookFromUserReadBooks(String userId, String bookId) {
        AppUser user = getAppUserById(userId);
        user.getReadBookIds().remove(bookId);
        return userRepository.save(user);
    }
}
