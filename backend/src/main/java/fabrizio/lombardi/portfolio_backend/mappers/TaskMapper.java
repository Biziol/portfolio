package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.Task;
import fabrizio.lombardi.portfolio_backend.models.dtos.TaskDto;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {
    public TaskDto toDto(Task task) {
        return new TaskDto(task.getId(), task.getTitle(), task.getDescription(), task.getState());
    }

    public Task toEntity(TaskDto dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setState(dto.getState());
        return task;
    }
}