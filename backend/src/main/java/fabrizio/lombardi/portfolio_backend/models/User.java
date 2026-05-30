package fabrizio.lombardi.portfolio_backend.models;

import fabrizio.lombardi.portfolio_backend.models.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {
    @Id
    private String username;
    private String password;
    private Role role;
}
