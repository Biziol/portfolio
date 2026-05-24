package fabrizio.lombardi.portfolio_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fabrizio.lombardi.portfolio_backend.models.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT COALESCE(AVG(r.stars), 0) FROM Review r")
    Double getRating();

    @Query("SELECT r FROM Review r ORDER BY r.creationDate DESC")
    List<Review> findAll();
}
