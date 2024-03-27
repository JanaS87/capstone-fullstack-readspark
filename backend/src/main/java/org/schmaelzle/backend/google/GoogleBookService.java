package org.schmaelzle.backend.google;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
@Service
public class GoogleBookService {

    private final RestClient restClient = RestClient.builder().baseUrl("https://www.googleapis.com/books/v1/volumes").build();

    public GoogleBookResponse searchBooks(String query) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("q", query)
                        .queryParam("langRestrict","de")
                        .queryParam("printType","books")
                        .build())
                .retrieve()
                .toEntity(GoogleBookResponse.class)
                .getBody();

    }
}
