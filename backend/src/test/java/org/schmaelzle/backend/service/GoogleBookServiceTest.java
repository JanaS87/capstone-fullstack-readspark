package org.schmaelzle.backend.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.google.GoogleBookResponse;
import org.schmaelzle.backend.google.GoogleBookService;


import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GoogleBookServiceTest {

    private MockWebServer mockWebServer;
    private GoogleBookService googleBookService;

    @BeforeEach
    public void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        googleBookService = new GoogleBookService();
    }

    @AfterEach
    public void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void searchBooks_whenCalledWithQuery_thenReturnsExpectedResponse() {
        String query = "Harry Potter und der Stein der Weisen";
        String expectedResponse = "{\"items\": [{\"volumeInfo\": {\"title\": \"Harry Potter und der Stein der Weisen\"}}]}";

        mockWebServer.enqueue(new MockResponse()
                .setBody(expectedResponse)
                .addHeader("Content-Type", "application/json"));

        GoogleBookResponse response = googleBookService.searchBooks(query);

        assert response != null;
        assertEquals("Harry Potter und der Stein der Weisen", response.items().getFirst().volumeInfo().title());
    }
}