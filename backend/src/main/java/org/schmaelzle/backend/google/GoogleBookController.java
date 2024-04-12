package org.schmaelzle.backend.google;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/google/books")
@RequiredArgsConstructor
public class GoogleBookController {

    private final GoogleBookService googleBookService;

     @GetMapping
     public GoogleBookResponse searchBooks(@RequestParam String q) {
         return googleBookService.searchBooks(q);
     }

     @GetMapping("/find-by-barcode")
        public GoogleBookResponse searchBooksByBarcode(@RequestBody String barcode) {
            return googleBookService.searchBooksByBarcode(barcode);
        }
}
