package fabrizio.lombardi.portfolio_backend.models.dtos;

import fabrizio.lombardi.portfolio_backend.models.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private String username;
    private Role role;
}
