package fabrizio.lombardi.portfolio_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fabrizio.lombardi.portfolio_backend.models.WorkAndTraining;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface WorkAndTrainingRepository extends JpaRepository<WorkAndTraining, Long> {
    @Query("SELECT w FROM WorkAndTraining w ORDER BY w.startDate DESC")
    List<WorkAndTraining> findAll();
}
