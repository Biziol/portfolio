package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import fabrizio.lombardi.portfolio_backend.models.Review;
import fabrizio.lombardi.portfolio_backend.repositories.ReviewRepository;

@Service
public class ReviewService {
    private final ReviewRepository repository;
    private final EmailService emailService;

    public ReviewService(ReviewRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public List<Review> findAll() {
        return repository.findAll();
    }

    public Optional<Review> findById(Long id) {
        return repository.findById(id);
    }

    public Review save(Review entity) {
        entity.setCreationDate(LocalDateTime.now());
        if (entity.getAuthor().equals("")) {
            entity.setAuthor("Anonimo");
        }
        Review saved = repository.save(entity);
        emailService.sendNewReviewNotification(saved);
        return saved;
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Double getRating() {
        return repository.getRating();
    }
}
