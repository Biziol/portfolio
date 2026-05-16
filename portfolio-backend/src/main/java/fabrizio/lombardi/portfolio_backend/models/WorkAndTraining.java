package fabrizio.lombardi.portfolio_backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import fabrizio.lombardi.portfolio_backend.models.enums.GraduationType;
import fabrizio.lombardi.portfolio_backend.models.enums.WorkType;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WorkAndTraining {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String instituteOrCompany;

    private String location;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private Double graduation;

    @Enumerated(EnumType.STRING)
    private GraduationType graduationType;

    private String website;

    @Enumerated(EnumType.STRING)
    private WorkType type;
}
