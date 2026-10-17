package fabrizio.lombardi.portfolio_backend.controllers;

import java.util.List;
import fabrizio.lombardi.portfolio_backend.services.GitHubService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
public class GitHubController {
    private final GitHubService service;

    public GitHubController(GitHubService service) {
        this.service = service;
    }

    @GetMapping("/repositories")
    public ResponseEntity<List<GitHubService.Repository>> repositories() {
        var repositories = service.getRepositories();
        if (repositories == null) {
            return ResponseEntity.status(503).header(HttpHeaders.RETRY_AFTER, "60").build();
        }
        return ResponseEntity.ok(repositories);
    }
}
