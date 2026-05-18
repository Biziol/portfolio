package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.SkillMapper;
import fabrizio.lombardi.portfolio_backend.models.Skill;
import fabrizio.lombardi.portfolio_backend.models.dtos.SkillDto;
import fabrizio.lombardi.portfolio_backend.services.SkillService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillService service;
    private final SkillMapper mapper;

    public SkillController(SkillService service, SkillMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<SkillDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(skill -> ResponseEntity.ok(mapper.toDto(skill)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SkillDto> create(@RequestBody SkillDto body) {
        Skill saved = service.save(mapper.toEntity(body));
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> update(@PathVariable Long id, @RequestBody SkillDto body) {
        return service.findById(id).map(existing -> {
            Skill entity = mapper.toEntity(body);
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
