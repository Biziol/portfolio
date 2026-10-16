package fabrizio.lombardi.portfolio_backend.controllers;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import fabrizio.lombardi.portfolio_backend.models.dtos.AiWorkflowDto;
import fabrizio.lombardi.portfolio_backend.services.AiWorkflowService;

@RestController
@RequestMapping("/api/ai-workflows")
public class AiWorkflowController {
    private final AiWorkflowService service;

    public AiWorkflowController(AiWorkflowService service) {
        this.service = service;
    }

    @GetMapping
    public List<AiWorkflowDto> published() {
        return service.published();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AiWorkflowDto> all() {
        return service.all();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AiWorkflowDto> create(@Valid @RequestBody AiWorkflowDto payload) {
        AiWorkflowDto saved = service.create(payload);
        return ResponseEntity.created(URI.create("/api/ai-workflows")).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AiWorkflowDto update(@PathVariable Long id, @Valid @RequestBody AiWorkflowDto payload) {
        return service.update(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
