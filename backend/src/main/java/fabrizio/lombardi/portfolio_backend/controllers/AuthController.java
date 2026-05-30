package fabrizio.lombardi.portfolio_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import fabrizio.lombardi.portfolio_backend.models.User;
import fabrizio.lombardi.portfolio_backend.models.dtos.UserDTO;
import fabrizio.lombardi.portfolio_backend.models.enums.Role;
import fabrizio.lombardi.portfolio_backend.repositories.UserRepo;
import fabrizio.lombardi.portfolio_backend.services.AuthenticationService;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;

    public AuthController(
            AuthenticationService authService,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            UserRepo userRepo) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepo = userRepo;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            User authenticatedUser = authService.getAuthUser();
            return ResponseEntity.ok(toDto(authenticatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        httpRequest.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());

        User user = authService.getAuthUser();
        return ResponseEntity.ok(toDto(user));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam(required = false) Role role) {
        if (userRepo.existsById(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (role == Role.ADMIN) {
            try {
                User current = authService.getAuthUser();
                if (current == null || !Role.ADMIN.equals(current.getRole())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
            } catch (AuthenticationCredentialsNotFoundException | UsernameNotFoundException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        User user = new User(
                username,
                passwordEncoder.encode(password),
                role == null ? Role.USER : role);

        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.ok().build();
    }

    private UserDTO toDto(User user) {
        UserDTO userDto = new UserDTO();
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        return userDto;
    }
}
