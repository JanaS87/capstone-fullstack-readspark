package org.schmaelzle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document
public class AppUser {
    private String id;
    private String username;
    private String avatarUrl;
    private List<String> favoriteBookIds;
    private List<String> bookIds;
    private List<String> readBookIds;
}
