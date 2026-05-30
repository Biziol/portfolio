package fabrizio.lombardi.portfolio_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fabrizio.lombardi.portfolio_backend.models.User;

public interface UserRepo extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}
