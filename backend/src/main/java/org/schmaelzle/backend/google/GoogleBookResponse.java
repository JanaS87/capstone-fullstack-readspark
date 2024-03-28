package org.schmaelzle.backend.google;

import java.util.List;

public record GoogleBookResponse(
        int totalItems,
        List <GoogleBook> items
) {
}
