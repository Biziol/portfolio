package fabrizio.lombardi.portfolio_backend.models.dtos;

import fabrizio.lombardi.portfolio_backend.models.enums.GraduationType;
import fabrizio.lombardi.portfolio_backend.models.enums.WorkType;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WorkAndTrainingDto {
    private long id;
    private String title;
    private String instituteOrCompany;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double graduation;
    private GraduationType graduationType;
    private String website;
    private WorkType type;
    private List<ArgumentDto> arguments;
}