package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.Review;
import fabrizio.lombardi.portfolio_backend.repositories.ReviewRepository;

@Service
public class ReviewService {
    private final ReviewRepository repository;

    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public List<Review> findAll() {
        return repository.findAll();
    }

    public Optional<Review> findById(Long id) {
        return repository.findById(id);
    }

    public Review save(Review entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
