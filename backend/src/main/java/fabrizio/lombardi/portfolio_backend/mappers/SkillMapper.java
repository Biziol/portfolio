package fabrizio.lombardi.portfolio_backend.mappers;

import fabrizio.lombardi.portfolio_backend.models.Skill;
import fabrizio.lombardi.portfolio_backend.models.dtos.SkillDto;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {
    public SkillDto toDto(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName(), skill.getSkillField());
    }

    public Skill toEntity(SkillDto dto) {
        Skill skill = new Skill();
        skill.setId(dto.getId());
        skill.setName(dto.getName());
        skill.setSkillField(dto.getSkillField());
        return skill;
    }
}