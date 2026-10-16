package fabrizio.lombardi.portfolio_backend.models.dtos;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record AiWorkflowDto(
        Long id,
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 1000) String objective,
        @NotNull @Size(max = 20) List<@NotBlank @Size(max = 80) String> tools,
        @NotEmpty @Size(max = 20) List<@NotNull @Valid Step> steps,
        @Size(max = 15000) String example,
        @Size(max = 32000) String conclusions,
        boolean published) {

    public record Step(
            @NotBlank @Size(max = 160) String title,
            @NotBlank @Size(max = 15000) String description) {
    }
}
