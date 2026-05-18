package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.ArgumentMapper;
import fabrizio.lombardi.portfolio_backend.models.dtos.ArgumentDto;
import fabrizio.lombardi.portfolio_backend.services.ArgumentService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arguments")
public class ArgumentController {
    private final ArgumentService service;
    private final ArgumentMapper mapper;

    public ArgumentController(ArgumentService service, ArgumentMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<ArgumentDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArgumentDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(argument -> ResponseEntity.ok(mapper.toDto(argument)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ArgumentDto> create(@RequestBody ArgumentDto body) {
        return ResponseEntity.status(201).body(mapper.toDto(service.save(mapper.toEntity(body))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArgumentDto> update(@PathVariable Long id, @RequestBody ArgumentDto body) {
        return service.findById(id).map(existing -> {
            var entity = mapper.toEntity(body);
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
