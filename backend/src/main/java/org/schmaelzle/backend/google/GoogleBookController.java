package org.schmaelzle.backend.google;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/google/books")
@RequiredArgsConstructor
public class GoogleBookController {

    private final GoogleBookService googleBookService;

     @GetMapping
     public GoogleBookResponse searchBooks(@RequestParam String q) {
         return googleBookService.searchBooks(q);
     }
}
