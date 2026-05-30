package fabrizio.lombardi.portfolio_backend.services;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import fabrizio.lombardi.portfolio_backend.models.User;
import fabrizio.lombardi.portfolio_backend.repositories.UserRepo;

@Service
public class AuthenticationService {

    private final UserRepo userRepo;
    
    public AuthenticationService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public Authentication getAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("User is not authenticated");
        }

        return authentication;
    }

    public User getAuthUser() {
        return userRepo.findByUsername(getAuth().getName())
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));
    }
}