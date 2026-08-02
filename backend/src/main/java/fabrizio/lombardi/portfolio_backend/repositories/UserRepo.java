package fabrizio.lombardi.portfolio_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fabrizio.lombardi.portfolio_backend.models.User;
import java.util.List;
import fabrizio.lombardi.portfolio_backend.models.enums.Role;

public interface UserRepo extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    List<User> findByRole(Role role);
}
