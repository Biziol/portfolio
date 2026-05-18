package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.Argument;
import fabrizio.lombardi.portfolio_backend.repositories.ArgumentRepository;

@Service
public class ArgumentService {
    private final ArgumentRepository repository;

    public ArgumentService(ArgumentRepository repository) {
        this.repository = repository;
    }

    public List<Argument> findAll() {
        return repository.findAll();
    }

    public Optional<Argument> findById(Long id) {
        return repository.findById(id);
    }

    public Argument save(Argument argument) {
        return repository.save(argument);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
