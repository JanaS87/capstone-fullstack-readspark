package org.schmaelzle.backend.controller;

import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.service.AppUserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService userService;

    @GetMapping("/me")
    public AppUser getMe(@AuthenticationPrincipal OAuth2User user) {
        return userService.getLoggedInUser(user.getAttributes().get("id").toString());
    }

    @PutMapping("/favorites/add/{bookId}")
    public AppUser addBookToFavorites(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.addBookToUserFavorites(user.getAttributes().get("id").toString(), bookId);
    }

    @PutMapping("/favorites/remove/{bookId}")
    public AppUser removeBookFromFavorites(@AuthenticationPrincipal OAuth2User user, @PathVariable String bookId) {
        return userService.removeBookFromUserFavorites(user.getAttributes().get("id").toString(), bookId);
    }
}
