package fabrizio.lombardi.portfolio_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import fabrizio.lombardi.portfolio_backend.models.ContactInformation;
import fabrizio.lombardi.portfolio_backend.services.ContactInformationService;

@RestController
@RequestMapping("/api/contacts")
public class ContactInformationController {
    private final ContactInformationService service;

    public ContactInformationController(ContactInformationService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContactInformation> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactInformation> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ContactInformation> create(@RequestBody ContactInformation body) {
        ContactInformation saved = service.save(body);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactInformation> update(@PathVariable Long id, @RequestBody ContactInformation body) {
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
