package org.schmaelzle.backend.repository;


import org.schmaelzle.backend.model.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListRepository extends MongoRepository<List, String> {
}
