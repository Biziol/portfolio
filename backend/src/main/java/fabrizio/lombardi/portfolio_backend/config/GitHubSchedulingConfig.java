package fabrizio.lombardi.portfolio_backend.config;

import fabrizio.lombardi.portfolio_backend.services.GitHubService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "app.github.scheduling-enabled", havingValue = "true", matchIfMissing = true)
public class GitHubSchedulingConfig {
    private final GitHubService service;

    public GitHubSchedulingConfig(GitHubService service) {
        this.service = service;
    }

    @Scheduled(fixedRate = 600_000, initialDelay = 0)
    public void refreshRepositories() {
        service.refresh();
    }
}
