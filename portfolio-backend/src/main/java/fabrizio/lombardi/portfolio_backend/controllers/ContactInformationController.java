package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.ContactInformationMapper;
import fabrizio.lombardi.portfolio_backend.models.ContactInformation;
import fabrizio.lombardi.portfolio_backend.models.dtos.ContactInformationDto;
import fabrizio.lombardi.portfolio_backend.services.ContactInformationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactInformationController {
    private final ContactInformationService service;
    private final ContactInformationMapper mapper;

    public ContactInformationController(ContactInformationService service, ContactInformationMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<ContactInformationDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactInformationDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(contactInformation -> ResponseEntity.ok(mapper.toDto(contactInformation)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ContactInformationDto> create(@RequestBody ContactInformationDto body) {
        ContactInformation saved = service.save(mapper.toEntity(body));
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactInformationDto> update(@PathVariable Long id,
            @RequestBody ContactInformationDto body) {
        return service.findById(id).map(existing -> {
            ContactInformation entity = mapper.toEntity(body);
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
