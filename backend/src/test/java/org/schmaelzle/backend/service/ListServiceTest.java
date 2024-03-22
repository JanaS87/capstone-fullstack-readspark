package org.schmaelzle.backend.service;

import org.junit.jupiter.api.Test;
import org.schmaelzle.backend.model.List;
import org.schmaelzle.backend.repository.ListRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

 class ListServiceTest {

    private final ListRepository repo = mock(ListRepository.class);

    private final ListService service = new ListService(repo);

    @Test
    void getAllLists_whenCalledInitially_ThenReturnEmptyList() {
        //Given
        java.util.List<List> expected = new java.util.ArrayList<>();
        when(repo.findAll()).thenReturn(new java.util.ArrayList<>());
        //When
        java.util.List<List> actual = service.getAllLists();
        //Then
        assertEquals(expected, actual);
        verify(repo).findAll();
    }
}
