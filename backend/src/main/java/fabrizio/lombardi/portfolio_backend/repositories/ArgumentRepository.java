package fabrizio.lombardi.portfolio_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import fabrizio.lombardi.portfolio_backend.models.Argument;

import java.util.List;

@Repository
public interface ArgumentRepository extends JpaRepository<Argument, Long> {
    @Query("select a from Argument a where a.workAndTraining.id = :workAndTrainingId")
    List<Argument> findAllByWorkAndTrainingId(@Param("workAndTrainingId") Long workAndTrainingId);
}
