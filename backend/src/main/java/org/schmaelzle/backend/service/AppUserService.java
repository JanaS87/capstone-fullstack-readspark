package org.schmaelzle.backend.service;

import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;

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
}
