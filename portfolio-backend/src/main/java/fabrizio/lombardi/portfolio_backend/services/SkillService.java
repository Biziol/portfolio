package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.Skill;
import fabrizio.lombardi.portfolio_backend.repositories.SkillRepository;

@Service
public class SkillService {
    private final SkillRepository repository;

    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }

    public List<Skill> findAll() {
        return repository.findAll();
    }

    public Optional<Skill> findById(Long id) {
        return repository.findById(id);
    }

    public Skill save(Skill entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
