package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.WorkAndTrainingMapper;
import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.models.dtos.WorkAndTrainingDto;
import fabrizio.lombardi.portfolio_backend.services.WorkAndTrainingService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work-and-training")
public class WorkAndTrainingController {
    private final WorkAndTrainingService service;
    private final WorkAndTrainingMapper mapper;

    public WorkAndTrainingController(WorkAndTrainingService service, WorkAndTrainingMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<WorkAndTrainingDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkAndTrainingDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(workAndTraining -> ResponseEntity.ok(mapper.toDto(workAndTraining)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkAndTrainingDto> create(@RequestBody WorkAndTrainingDto body) {
        WorkAndTraining saved = service.save(mapper.toEntity(body));
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkAndTrainingDto> update(@PathVariable Long id, @RequestBody WorkAndTrainingDto body) {
        return service.findById(id).map(existing -> {
            WorkAndTraining entity = mapper.toEntity(body);
            entity.setId(existing.getId());
            return ResponseEntity.ok(mapper.toDto(service.save(entity)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
