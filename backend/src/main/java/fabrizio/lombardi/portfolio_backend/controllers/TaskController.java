package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.TaskMapper;
import fabrizio.lombardi.portfolio_backend.models.Task;
import fabrizio.lombardi.portfolio_backend.models.dtos.TaskDto;
import fabrizio.lombardi.portfolio_backend.services.TaskService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    private final TaskMapper mapper;

    public TaskController(TaskService service, TaskMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<TaskDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(task -> ResponseEntity.ok(mapper.toDto(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody TaskDto body) {
        Task saved = service.save(mapper.toEntity(body));
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> update(@PathVariable Long id, @RequestBody TaskDto body) {
        return service.findById(id).map(existing -> {
            Task entity = mapper.toEntity(body);
            entity.setId(existing.getId());
            return ResponseEntity.ok(mapper.toDto(service.save(entity)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
