package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import fabrizio.lombardi.portfolio_backend.repositories.WorkAndTrainingRepository;

@Service
public class WorkAndTrainingService {
    private final WorkAndTrainingRepository repository;

    public WorkAndTrainingService(WorkAndTrainingRepository repository) {
        this.repository = repository;
    }

    public List<WorkAndTraining> findAll() {
        return repository.findAll();
    }

    public Optional<WorkAndTraining> findById(Long id) {
        return repository.findById(id);
    }

    public WorkAndTraining save(WorkAndTraining entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
