package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.ContactInformation;
import fabrizio.lombardi.portfolio_backend.repositories.ContactInformationRepository;

@Service
public class ContactInformationService {
    private final ContactInformationRepository repository;

    public ContactInformationService(ContactInformationRepository repository) {
        this.repository = repository;
    }

    public List<ContactInformation> findAll() {
        return repository.findAll();
    }

    public Optional<ContactInformation> findById(Long id) {
        return repository.findById(id);
    }

    public ContactInformation save(ContactInformation entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
