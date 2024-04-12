package org.schmaelzle.backend.controller;

import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.google.GoogleBook;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService userService;

    @GetMapping("/me")
    public AppUser getMe(@AuthenticationPrincipal OAuth2User user) {
        return userService.getLoggedInUser(user.getAttributes().get("id").toString());
    }

    @PostMapping("/books/{bookId}")
    public AppUser addBookToUser(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.addBookToUserBooks(user.getAttributes().get("id").toString(), bookId);
    }

    @DeleteMapping("/books/{bookId}")
    public AppUser removeBookFromUser(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.removeBookFromUserBooks(user.getAttributes().get("id").toString(), bookId);
    }

    @GetMapping("/books")
    public List<GoogleBook> getBooks(@AuthenticationPrincipal OAuth2User user) {
        return userService.getBooks(user.getAttributes().get("id").toString());
    }

    @PostMapping("/books/favorites/{bookId}")
    public AppUser addBookToUserFavorites(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.addBookToUserFavorites(user.getAttributes().get("id").toString(), bookId);
    }

    @DeleteMapping("/books/favorites/{bookId}")
    public AppUser removeBookFromUserFavorites(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.removeBookFromUserFavorites(user.getAttributes().get("id").toString(), bookId);
    }

    @GetMapping("/books/favorites")
    public List<GoogleBook> getFavoriteBooks(@AuthenticationPrincipal OAuth2User user) {
        return userService.getFavoriteBooks(user.getAttributes().get("id").toString());
    }

    @GetMapping("/books/read")
    public List<GoogleBook> getReadBooks(@AuthenticationPrincipal OAuth2User user) {
        return userService.getReadBooks(user.getAttributes().get("id").toString());
    }

    @PostMapping("/books/read/{bookId}")
    public AppUser addBookToUserReadBooks(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.addBookToUserReadBooks(user.getAttributes().get("id").toString(), bookId);
    }

    @DeleteMapping("/books/read/{bookId}")
    public AppUser removeBookFromUserReadBooks(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.removeBookFromUserReadBooks(user.getAttributes().get("id").toString(), bookId);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgument(IllegalArgumentException e) {
        return e.getMessage();
    }



}
