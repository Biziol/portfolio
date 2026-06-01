package fabrizio.lombardi.portfolio_backend.controllers;

import fabrizio.lombardi.portfolio_backend.mappers.ReviewMapper;
import fabrizio.lombardi.portfolio_backend.models.Review;
import fabrizio.lombardi.portfolio_backend.models.dtos.ReviewDto;
import fabrizio.lombardi.portfolio_backend.services.ReviewService;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService service;
    private final ReviewMapper mapper;

    public ReviewController(ReviewService service, ReviewMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @Operation(summary = "Restituisce tutte le recensioni")
    @GetMapping
    public List<ReviewDto> all() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @Operation(summary = "Restituisce una specifica recensione")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> get(@PathVariable Long id) {
        return service.findById(id)
                .map(review -> ResponseEntity.ok(mapper.toDto(review)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crea una recensione")
    @PostMapping
    public ResponseEntity<ReviewDto> create(@RequestBody ReviewDto body) {
        Review saved = service.save(mapper.toEntity(body));
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @Operation(summary = "Aggiorna una recensione (admin-only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> update(@PathVariable Long id, @RequestBody ReviewDto body) {
        return service.findById(id).map(existing -> {
            Review entity = mapper.toEntity(body);
            entity.setId(existing.getId());
            return ResponseEntity.ok(mapper.toDto(service.save(entity)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cancella una recensione (admin-only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restituisce la media delle recensioni")
    @GetMapping({ "/rating", "/raiting" })
    public Double getRating() {
        return service.getRating();
    }

}
