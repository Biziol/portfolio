package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.Argument;
import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.models.dtos.ArgumentDto;
import fabrizio.lombardi.portfolio_backend.services.WorkAndTrainingService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ArgumentMapper {
    private final WorkAndTrainingService workAndTrainingService;

    public ArgumentMapper(WorkAndTrainingService workAndTrainingService) {
        this.workAndTrainingService = workAndTrainingService;
    }

    public ArgumentDto toDto(Argument argument) {
        Long workAndTrainingId = argument.getWorkAndTraining() != null ? argument.getWorkAndTraining().getId() : null;
        return new ArgumentDto(argument.getId(), argument.getText(), workAndTrainingId);
    }

    public Argument toEntity(ArgumentDto dto) {
        Argument argument = new Argument();
        argument.setId(dto.getId());
        argument.setText(dto.getText());
        argument.setWorkAndTraining(resolveWorkAndTraining(dto.getWorkAndTrainingId()));
        return argument;
    }

    private WorkAndTraining resolveWorkAndTraining(Long workAndTrainingId) {
        if (workAndTrainingId == null) {
            return null;
        }

        return workAndTrainingService.findById(workAndTrainingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "WorkAndTraining not found"));
    }
}