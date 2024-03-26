package org.schmaelzle.backend.model;

public record BookDto(
        String title,
        String author,
        String genre,
        String isbn,
        String publisher,
        boolean favorite,
        boolean read,
        String blurb
) {
}
