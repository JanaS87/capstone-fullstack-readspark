package org.schmaelzle.backend.model;


import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document("books")
public record Book(
        String id,
        String title,
        String author,
        String genre,
        String isbn,
        boolean favorite,
        boolean read,
        String blurb
) {
}
