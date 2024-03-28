package org.schmaelzle.backend.google;

import java.util.List;

public record VolumeInfo(
        String title,
        List<String> authors,
        String publisher,
        List<IndustryIdentifier> industryIdentifiers,
        List<String> categories,
        ImageLink imageLinks,
        String description
) {
}
