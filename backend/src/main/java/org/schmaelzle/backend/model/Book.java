package org.schmaelzle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("books")
public class Book{
private String id;
private String title;
private String author;
private String genre;
private String publisher;
private String isbn;
private boolean favorite;
private boolean read;
private String blurb;
}

