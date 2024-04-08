package org.schmaelzle.backend.controller;



import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;

import java.io.IOException;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
 class GoogleBookControllerTest {

    @Autowired
    private MockMvc mvc;

    private static MockWebServer mockWebServer;

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
    void testSearchBooks() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                        .addHeader("Content-Type", "application/json")
                .setBody("""
                        {
                            "kind": "books#volumes",
                            "totalItems": 1,
                            "items": [
                                {
                                    "kind": "books#volume",
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
                            ]
                        }
                        """));

        mvc.perform(MockMvcRequestBuilders.get("/api/google/books?q=Harry Potter und der Stein der Weisen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].volumeInfo.title", is("Harry Potter und der Stein der Weisen")))
                .andExpect(jsonPath("$.items[0].volumeInfo.authors[0]", is(not(emptyString()))))
                .andExpect(jsonPath("$.items[0].volumeInfo.categories[0]", is(not(emptyString()))))
                .andExpect(jsonPath("$.items[0].volumeInfo.publisher", is("Carlsen Verlag GmbH")))
                .andExpect(jsonPath("$.items[0].volumeInfo.industryIdentifiers[0].identifier", is(not(emptyString()))));
    }

    @Test
    void testSearchBooksByBarcode() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .addHeader("Content-Type", "application/json")
                .setBody("""
                        {
                            "kind": "books#volumes",
                            "totalItems": 1,
                            "items": [
                                {
                                    "kind": "books#volume",
                                    "volumeInfo": {
                                        "title": "Die Magie der Scheibenwelt",
                                        "authors": ["Terry Pratchett"],
                                        "categories": ["Fantasy"],
                                        "publisher": "Piper",
                                        "industryIdentifiers": [
                                            {
                                                "type": "ISBN_13",
                                                "identifier": "9783492285193"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                        """));

        mvc.perform(MockMvcRequestBuilders.post("/api/google/books/find-by-barcode")
                .contentType("text/plain")
                .content("39076002631195"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].volumeInfo.title", is("Die Magie der Scheibenwelt")))
                .andExpect(jsonPath("$.items[0].volumeInfo.authors[0]", is(not(emptyString()))))
                .andExpect(jsonPath("$.items[0].volumeInfo.categories[0]", is(not(emptyString()))))
                .andExpect(jsonPath("$.items[0].volumeInfo.publisher", is("Piper")))
                .andExpect(jsonPath("$.items[0].volumeInfo.industryIdentifiers[0].identifier", is("9783492285193")));
    }
}
