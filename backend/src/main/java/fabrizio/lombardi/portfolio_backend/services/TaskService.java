package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.Task;
import fabrizio.lombardi.portfolio_backend.repositories.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> findAll(String username) {
        List<Task> tasks = repository.findAllByUserUsernameOrderByCreationDateDesc(username);
        if (tasks == null) {
            return Collections.emptyList();
        }
        return tasks;
    }

    public Optional<Task> findById(Long id) {
        return repository.findById(id);
    }

    public Task save(Task entity) {
        entity.setCreationDate(LocalDateTime.now());
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
