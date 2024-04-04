package org.schmaelzle.backend.google;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
@Service
public class GoogleBookService {

    private final RestClient restClient;
    public GoogleBookService( @Value("${google.books.api.url}")String googleBooksUrl) {
        this.restClient = RestClient.builder().baseUrl(googleBooksUrl).build();
    }

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

    public GoogleBookResponse searchBooksByBarcode(String barcode) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("q", "isbn:" + barcode)
                        .queryParam("langRestrict","de")
                        .queryParam("printType","books")
                        .build())
                .retrieve()
                .toEntity(GoogleBookResponse.class)
                .getBody();
    }
}
