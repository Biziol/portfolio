package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.models.dtos.WorkAndTrainingDto;
import org.springframework.stereotype.Component;

@Component
public class WorkAndTrainingMapper {
    public WorkAndTrainingDto toDto(WorkAndTraining workAndTraining) {
        return new WorkAndTrainingDto(
                workAndTraining.getId(),
                workAndTraining.getTitle(),
                workAndTraining.getInstituteOrCompany(),
                workAndTraining.getLocation(),
                workAndTraining.getStartDate(),
                workAndTraining.getEndDate(),
                workAndTraining.getGraduation(),
                workAndTraining.getGraduationType(),
                workAndTraining.getWebsite(),
                workAndTraining.getType());
    }

    public WorkAndTraining toEntity(WorkAndTrainingDto dto) {
        WorkAndTraining workAndTraining = new WorkAndTraining();
        workAndTraining.setId(dto.getId());
        workAndTraining.setTitle(dto.getTitle());
        workAndTraining.setInstituteOrCompany(dto.getInstituteOrCompany());
        workAndTraining.setLocation(dto.getLocation());
        workAndTraining.setStartDate(dto.getStartDate());
        workAndTraining.setEndDate(dto.getEndDate());
        workAndTraining.setGraduation(dto.getGraduation());
        workAndTraining.setGraduationType(dto.getGraduationType());
        workAndTraining.setWebsite(dto.getWebsite());
        workAndTraining.setType(dto.getType());
        return workAndTraining;
    }
}