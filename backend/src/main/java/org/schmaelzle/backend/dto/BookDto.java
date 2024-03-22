package org.schmaelzle.backend.dto;

import org.schmaelzle.backend.model.List;

public record BookDto(
        String title,
        String author,
        String genre,
        String isbn,
        boolean favorite,
        boolean read,
        String blurb,
        List list
) {
}
