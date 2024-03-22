package org.schmaelzle.backend.controller;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.List;
import org.schmaelzle.backend.service.ListService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListController {

    private final ListService service;

    @GetMapping
    public java.util.List<List> getAllLists() {
        return service.getAllLists();
    }
}
