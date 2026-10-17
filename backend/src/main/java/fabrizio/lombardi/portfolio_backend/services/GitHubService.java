package fabrizio.lombardi.portfolio_backend.services;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GitHubService {
    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);
    private final RestClient client;
    private final String username;
    // A complete, immutable snapshot is published atomically, without blocking readers.
    private volatile List<Repository> snapshot;

    public record Repository(long id, String title, String html_url, String description, List<String> topics) {}
    public record GitHubRepository(long id, String name, String html_url, String description,
                                   boolean fork, List<String> topics) {}

    @Autowired
    public GitHubService(@Value("${app.github.username:Biziol}") String username,
                         @Value("${app.github.token:}") String token) {
        this(createClient(RestClient.builder(), token), username);
    }

    GitHubService(RestClient client, String username) {
        this.client = client;
        this.username = username;
    }

    private static RestClient createClient(RestClient.Builder builder, String token) {
        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(10000);
        var configured = builder.baseUrl("https://api.github.com")
                .requestFactory(requestFactory)
                .defaultHeader("Accept", "application/vnd.github+json")
                .defaultHeader("X-GitHub-Api-Version", "2022-11-28")
                .defaultHeader("User-Agent", "Portfolio-Backend");
        if (!token.isBlank()) configured.defaultHeader("Authorization", "Bearer " + token);
        return configured.build();
    }

    public List<Repository> getRepositories() {
        return snapshot;
    }

    public synchronized void refresh() {
        try {
            var updated = new ArrayList<Repository>();
            for (int page = 1; ; page++) {
                GitHubRepository[] repositories = client.get()
                        .uri("/users/{username}/repos?sort=updated&per_page=100&page={page}", username, page)
                        .retrieve().body(GitHubRepository[].class);
                if (repositories == null) throw new IllegalStateException("Empty GitHub response body");
                for (var repository : repositories) {
                    if (!repository.fork()) {
                        updated.add(new Repository(repository.id(), repository.name(), repository.html_url(),
                                repository.description(), repository.topics() == null
                                        ? List.of() : List.copyOf(repository.topics())));
                    }
                }
                if (repositories.length < 100) break;
            }
            snapshot = List.copyOf(updated);
            log.info("GitHub cache updated: {} repositories", updated.size());
        } catch (RuntimeException exception) {
            // Never replace a successful snapshot with a partial response or an error.
            log.warn("GitHub cache update failed; keeping the previous snapshot ({})",
                    exception.getClass().getSimpleName());
        }
    }
}
