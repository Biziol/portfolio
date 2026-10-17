package fabrizio.lombardi.portfolio_backend.controllers;

import java.time.LocalDate;
import fabrizio.lombardi.portfolio_backend.services.CvSignatureService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv/signature")
public class CvSignatureController {
    private final CvSignatureService service;

    public CvSignatureController(CvSignatureService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<CvSignatureService.Signature> get() {
        return service.get().map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public CvSignatureService.Signature save(@RequestParam("image") MultipartFile image,
            @RequestParam("signedOn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate signedOn) {
        return service.save(image, signedOn);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete() {
        service.delete();
        return ResponseEntity.noContent().build();
    }
}
