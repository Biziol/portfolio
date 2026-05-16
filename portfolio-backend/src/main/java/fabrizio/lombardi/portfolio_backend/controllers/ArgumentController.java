package fabrizio.lombardi.portfolio_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import fabrizio.lombardi.portfolio_backend.models.Argument;
import fabrizio.lombardi.portfolio_backend.services.ArgumentService;

@RestController
@RequestMapping("/api/arguments")
public class ArgumentController {
    private final ArgumentService service;

    public ArgumentController(ArgumentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Argument> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Argument> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Argument> create(@RequestBody Argument body) {
        Argument saved = service.save(body);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Argument> update(@PathVariable Long id, @RequestBody Argument body) {
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
