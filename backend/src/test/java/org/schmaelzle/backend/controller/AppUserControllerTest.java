package org.schmaelzle.backend.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.*;
import org.schmaelzle.backend.google.GoogleBook;
import org.schmaelzle.backend.model.AppUser;
import org.schmaelzle.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AppUserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AppUserRepository appUserRepository;

    private static MockWebServer mockWebServer;

    @Autowired
    private ObjectMapper objectMapper;


    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @DynamicPropertySource
    static void backendProperties(DynamicPropertyRegistry registry) {
        registry.add("google.books.api.url", () -> mockWebServer.url("/").toString());
    }

    @Test
    void testGetMe() throws Exception {
        // given
        AppUser user = new AppUser("123", "test", "image", List.of(), List.of(), List.of());
        appUserRepository.save(user);
        // when
        mvc.perform(get("/api/users/me")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", List.of())
                                .claim("bookIds", List.of())
                                .claim("readBookIds", List.of()))))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                                                    "id": "123",
                                                    "username": "test",
                                                    "avatarUrl": "image",
                                                    "favoriteBookIds": [],
                                                    "bookIds": [],
                                                    "readBookIds": []
                                                }
                        """));
    }

    @Test
    void testAddBookToUser() throws Exception {
        // given
        AppUser user = new AppUser("123", "test", "image", List.of(), List.of(), List.of());
        appUserRepository.save(user);
        String bookId = "2";
        // when
        mvc.perform(MockMvcRequestBuilders.post("/api/users/books/{bookId}", bookId)
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", List.of())
                                .claim("bookIds", List.of())
                                .claim("readBookIds", List.of())))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": [],
                            "bookIds": ["2"],
                            "readBookIds": []
                        }
                        """));
    }

    @Test
    void testRemoveBookFromUser() throws Exception {
        // given
        ArrayList<String> bookIds = new ArrayList<>();
        bookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), bookIds, new ArrayList<>());
        appUserRepository.save(user);

        // when
        mvc.perform(MockMvcRequestBuilders.delete("/api/users/books/{bookId}", "2")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", bookIds)
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": [],
                            "bookIds": [],
                            "readBookIds": []
                        }
                        """));
        // then
        AppUser updatedUser = appUserRepository.findById(user.getId()).orElseThrow();
        Assertions.assertFalse(updatedUser.getBookIds().contains("2"));
    }

    @Test
    void testGetBooks() throws Exception {
        // given
        ArrayList<String> bookIds = new ArrayList<>();
        bookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), bookIds, new ArrayList<>());
        appUserRepository.save(user);

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .addHeader("Content-Type", "application/json")
                .setBody("""
                           {
                             "id": "2",
                             "volumeInfo": {
                                "title": "Harry Potter und der Stein der Weisen",
                                "authors": ["J. K. Rowling"],
                                 "categories": ["Children's literature, English"],
                                 "publisher": "Carlsen Verlag GmbH",
                                 "industryIdentifiers": [
                                    {
                                       "type": "OTHER",
                                       "identifier": "UOM:39076002631195"
                                    }
                                ]
                             }
                           }
                """));

        // when
        var result = mvc.perform(get("/api/users/books")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", bookIds)
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andReturn();

        // then
        List<GoogleBook> books = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {
        });
        Assertions.assertFalse(books.isEmpty());
    }

    @Test
    void testAddBookToUserFavorites() throws Exception {
        // given
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        appUserRepository.save(user);
        String bookId = "2";

        // when
        mvc.perform(MockMvcRequestBuilders.post("/api/users/books/favorites/{bookId}", bookId)
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": ["2"],
                            "bookIds": [],
                            "readBookIds": []
                        }
                        """));
    }

    @Test
    void testRemoveBookFromUserFavorites() throws Exception {
        // given
        ArrayList<String> favoriteBookIds = new ArrayList<>();
        favoriteBookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", favoriteBookIds, new ArrayList<>(), new ArrayList<>());
        appUserRepository.save(user);

        // when
        mvc.perform(MockMvcRequestBuilders.delete("/api/users/books/favorites/{bookId}", "2")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", favoriteBookIds)
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": [],
                            "bookIds": [],
                            "readBookIds": []
                        }
                        """));
        // then
        AppUser updatedUser = appUserRepository.findById(user.getId()).orElseThrow();
        Assertions.assertFalse(updatedUser.getFavoriteBookIds().contains("2"));
    }

    @Test
    void testGetFavoriteBooks() throws Exception {
        // given
        ArrayList<String> favoriteBookIds = new ArrayList<>();
        favoriteBookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", favoriteBookIds, new ArrayList<>(), new ArrayList<>());
        appUserRepository.save(user);

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .addHeader("Content-Type", "application/json")
                .setBody("""
                           {
                             "id": "2",
                             "volumeInfo": {
                                "title": "Harry Potter und der Stein der Weisen",
                                "authors": ["J. K. Rowling"],
                                 "categories": ["Children's literature, English"],
                                 "publisher": "Carlsen Verlag GmbH",
                                 "industryIdentifiers": [
                                    {
                                       "type": "OTHER",
                                       "identifier": "UOM:39076002631195"
                                    }
                                ]
                             }
                           }
                """));

        // when
        var result = mvc.perform(get("/api/users/books/favorites")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", favoriteBookIds)
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andReturn();

        // then
        List<GoogleBook> favoriteBooks = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {
        });
        Assertions.assertFalse(favoriteBooks.isEmpty());
    }

    @Test
    void testGetReadBooks() throws Exception {
        // given
        ArrayList<String> readBookIds = new ArrayList<>();
        readBookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), new ArrayList<>(), readBookIds);
        appUserRepository.save(user);

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .addHeader("Content-Type", "application/json")
                .setBody("""
                                   {
                                     "id": "2",
                                     "volumeInfo": {
                                        "title": "Harry Potter und der Stein der Weisen",
                                        "authors": ["J. K. Rowling"],
                                         "categories": ["Children's literature, English"],
                                         "publisher": "Carlsen Verlag GmbH",
                                         "industryIdentifiers": [
                                            {
                                               "type": "OTHER",
                                               "identifier": "UOM:39076002631195"
                                            }
                                        ]
                                     }
                                   }
                        """));
        // when
        var result = mvc.perform(get("/api/users/books/read")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", readBookIds)))
                )
                .andExpect(status().isOk())
                .andReturn();

        // then
        List<GoogleBook> favoriteBooks = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {
        });
        Assertions.assertFalse(favoriteBooks.isEmpty());
    }

    @Test
    void testAddBookToUserReadBooks() throws Exception {
        // given
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        appUserRepository.save(user);
        String bookId = "2";

        // when
        mvc.perform(MockMvcRequestBuilders.post("/api/users/books/read/{bookId}", bookId)
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", new ArrayList<>())))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": [],
                            "bookIds": [],
                            "readBookIds": ["2"]
                        }
                        """));
    }

    @Test
    void testRemoveBookFromUserReadBooks() throws Exception {
        // given
        ArrayList<String> readBookIds = new ArrayList<>();
        readBookIds.add("2");
        AppUser user = new AppUser("123", "test", "image", new ArrayList<>(), new ArrayList<>(), readBookIds);
        appUserRepository.save(user);

        // when
        mvc.perform(MockMvcRequestBuilders.delete("/api/users/books/read/{bookId}", "2")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "123")
                                .claim("username", "test")
                                .claim("avatarUrl", "image")
                                .claim("favoriteBookIds", new ArrayList<>())
                                .claim("bookIds", new ArrayList<>())
                                .claim("readBookIds", readBookIds)))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "123",
                            "username": "test",
                            "avatarUrl": "image",
                            "favoriteBookIds": [],
                            "bookIds": [],
                            "readBookIds": []
                        }
                        """));
        // then
        AppUser updatedUser = appUserRepository.findById(user.getId()).orElseThrow();
        Assertions.assertFalse(updatedUser.getReadBookIds().contains("2"));
    }


}
