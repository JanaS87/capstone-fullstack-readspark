package org.schmaelzle.backend.service;


import lombok.RequiredArgsConstructor;
import org.schmaelzle.backend.model.List;
import org.schmaelzle.backend.repository.ListRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListService {

    private final ListRepository repo;

    public java.util.List<List> getAllLists() {
        return repo.findAll();
    }
}
