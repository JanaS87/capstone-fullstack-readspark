package org.schmaelzle.backend.model;

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
