package org.schmaelzle.backend.controller;


import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
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

    private MockWebServer mockWebServer;

    @BeforeEach
    public void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterEach
    public void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void testSearchBooks() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
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
                .andExpect(jsonPath("$.items[0].volumeInfo.categories[0]", is("Children's literature, English")))
                .andExpect(jsonPath("$.items[0].volumeInfo.publisher", is("Carlsen Verlag GmbH")))
                .andExpect(jsonPath("$.items[0].volumeInfo.industryIdentifiers[0].identifier", is("UOM:39076002631195")));
    }
}
