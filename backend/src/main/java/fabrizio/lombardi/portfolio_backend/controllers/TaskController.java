package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.TaskMapper;
import fabrizio.lombardi.portfolio_backend.models.Task;
import fabrizio.lombardi.portfolio_backend.models.dtos.TaskDto;
import fabrizio.lombardi.portfolio_backend.services.AuthenticationService;
import fabrizio.lombardi.portfolio_backend.services.TaskService;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    private final TaskMapper mapper;
    private final AuthenticationService authService;

    public TaskController(TaskService service, TaskMapper mapper, AuthenticationService authService) {
        this.service = service;
        this.mapper = mapper;
        this.authService = authService;
    }

    @Operation(summary = "Restituisce tutte le task (CRUD-user-only)")
    @GetMapping
    public List<TaskDto> all() {
        return service.findAll(authService.getAuthUser().getUsername()).stream().map(mapper::toDto).toList();
    }

    @Operation(summary = "Restituisce una specifica task (CRUD-user-only)")
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(task -> ResponseEntity.ok(mapper.toDto(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crea una task (CRUD-user-only)")
    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody TaskDto body) {
        var authUser = authService.getAuthUser();
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Task entity = mapper.toEntity(body);
        entity.setUser(authUser);
        Task saved = service.save(entity);
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @Operation(summary = "Aggiorna una task (CRUD-user-only)")
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> update(@PathVariable Long id, @RequestBody TaskDto body) {
        var maybe = service.findById(id);
        if (maybe.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task existing = maybe.get();
        var authUser = authService.getAuthUser();
        if (authUser == null || existing.getUser() == null
                || !authUser.getUsername().equals(existing.getUser().getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Task entity = mapper.toEntity(body);
        entity.setId(existing.getId());
        entity.setUser(existing.getUser());
        return ResponseEntity.ok(mapper.toDto(service.save(entity)));
    }

    @Operation(summary = "Cancella una task (CRUD-user-only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Task taskToDelete = service.findById(id).orElse(null);

        if (taskToDelete != null && taskToDelete.getUser().equals(authService.getAuthUser())) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } else
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }
}
