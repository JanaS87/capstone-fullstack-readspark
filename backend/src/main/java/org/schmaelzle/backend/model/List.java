package org.schmaelzle.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document("lists")
public record List(
        String id,
        String name
) {
}
