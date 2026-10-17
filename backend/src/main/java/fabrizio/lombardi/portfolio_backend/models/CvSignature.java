package fabrizio.lombardi.portfolio_backend.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CvSignature {
    @Id
    private Long id = 1L;
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imageDataUrl;
    @Column(nullable = false)
    private LocalDate signedOn;
}
