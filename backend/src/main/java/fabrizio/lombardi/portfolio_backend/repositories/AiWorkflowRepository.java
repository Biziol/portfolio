package fabrizio.lombardi.portfolio_backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import fabrizio.lombardi.portfolio_backend.models.AiWorkflow;

public interface AiWorkflowRepository extends JpaRepository<AiWorkflow, Long> {
    List<AiWorkflow> findAllByPublishedTrueOrderByIdDesc();
    List<AiWorkflow> findAllByOrderByIdDesc();
}
