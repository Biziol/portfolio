package fabrizio.lombardi.portfolio_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.services.WorkAndTrainingService;

@RestController
@RequestMapping("/api/work-and-training")
public class WorkAndTrainingController {
    private final WorkAndTrainingService service;

    public WorkAndTrainingController(WorkAndTrainingService service) {
        this.service = service;
    }

    @GetMapping
    public List<WorkAndTraining> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkAndTraining> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WorkAndTraining> create(@RequestBody WorkAndTraining body) {
        WorkAndTraining saved = service.save(body);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkAndTraining> update(@PathVariable Long id, @RequestBody WorkAndTraining body) {
        return service.findById(id).map(existing -> {
            body.setId(existing.getId());
            return ResponseEntity.ok(service.save(body));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
