package fabrizio.lombardi.portfolio_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import fabrizio.lombardi.portfolio_backend.models.ContactInformation;

@Repository
public interface ContactInformationRepository extends JpaRepository<ContactInformation, Long> {
}
