package fabrizio.lombardi.portfolio_backend.models.dtos;

import java.time.LocalDateTime;

import fabrizio.lombardi.portfolio_backend.models.enums.TaskState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TaskDto {
    private long id;
    private String title;
    private String description;
    private TaskState state;
    private LocalDateTime creationDate;
}