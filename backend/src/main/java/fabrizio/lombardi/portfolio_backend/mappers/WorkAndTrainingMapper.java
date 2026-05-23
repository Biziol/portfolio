package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.models.dtos.ArgumentDto;
import fabrizio.lombardi.portfolio_backend.models.dtos.WorkAndTrainingDto;
import fabrizio.lombardi.portfolio_backend.services.ArgumentService;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class WorkAndTrainingMapper {
    private final ArgumentService argumentService;
    private final ArgumentMapper argumentMapper;

    public WorkAndTrainingMapper(ArgumentService argumentService, ArgumentMapper argumentMapper) {
        this.argumentService = argumentService;
        this.argumentMapper = argumentMapper;
    }

    public WorkAndTrainingDto toDto(WorkAndTraining workAndTraining) {
        List<ArgumentDto> arguments = argumentService.findAllByWorkAndTrainingId(workAndTraining.getId())
                .stream()
                .map(argumentMapper::toDto)
                .toList();

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
                workAndTraining.getType(),
                arguments);
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