package org.schmaelzle.backend.repository;

import org.schmaelzle.backend.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AppUserRepository extends MongoRepository<AppUser, String>{
}
