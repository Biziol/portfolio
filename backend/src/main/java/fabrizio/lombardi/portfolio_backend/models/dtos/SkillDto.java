package fabrizio.lombardi.portfolio_backend.models.dtos;

import fabrizio.lombardi.portfolio_backend.models.enums.SkillField;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SkillDto {
    private long id;
    private String name;
    private SkillField skillField;
}