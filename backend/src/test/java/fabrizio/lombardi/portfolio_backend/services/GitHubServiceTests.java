package fabrizio.lombardi.portfolio_backend.services;

import fabrizio.lombardi.portfolio_backend.controllers.GitHubController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GitHubServiceTests {
    private MockRestServiceServer github;
    private GitHubService service;
    private MockMvc mvc;
    private static final String URL = "https://api.github.com/users/Biziol/repos?sort=updated&per_page=100&page=1";
    private static final String REPOSITORIES = """
        [{"id":1,"name":"portfolio","html_url":"https://github.com/Biziol/portfolio",
          "description":null,"fork":false,"topics":["react","fullstack"]},
         {"id":2,"name":"fork","fork":true,"topics":[]}]
        """;

    @BeforeEach
    void setup() {
        var builder = RestClient.builder().baseUrl("https://api.github.com");
        github = MockRestServiceServer.bindTo(builder).build();
        service = new GitHubService(builder.build(), "Biziol");
        mvc = MockMvcBuilders.standaloneSetup(new GitHubController(service)).build();
    }

    @Test
    void visitsNeverCallGithubAndShareTheScheduledSnapshot() throws Exception {
        mvc.perform(get("/api/github/repositories")).andExpect(status().isServiceUnavailable())
                .andExpect(header().string("Retry-After", "60"));
        github.expect(requestTo(URL)).andRespond(withSuccess(REPOSITORIES, MediaType.APPLICATION_JSON));
        service.refresh();
        for (int visit = 0; visit < 20; visit++) {
            mvc.perform(get("/api/github/repositories")).andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].title").value("portfolio"))
                    .andExpect(jsonPath("$[0].topics[0]").value("react"));
        }
        github.verify();
    }

    @Test
    void rateLimitAndInvalidResponsesKeepTheLastSuccessfulSnapshot() {
        github.expect(requestTo(URL)).andRespond(withSuccess(REPOSITORIES, MediaType.APPLICATION_JSON));
        github.expect(requestTo(URL)).andRespond(withStatus(HttpStatus.FORBIDDEN));
        github.expect(requestTo(URL)).andRespond(withSuccess("not json", MediaType.APPLICATION_JSON));
        github.expect(requestTo(URL)).andRespond(withSuccess("[]", MediaType.APPLICATION_JSON));
        service.refresh();
        var previous = service.getRepositories();
        service.refresh();
        assertSame(previous, service.getRepositories());
        service.refresh();
        assertSame(previous, service.getRepositories());
        service.refresh();
        assertTrue(service.getRepositories().isEmpty());
        github.verify();
    }

    @Test
    void failureOnLaterPageDoesNotPublishPartialData() {
        String fullPage = "[" + String.join(",", java.util.Collections.nCopies(100,
                "{\"id\":1,\"name\":\"project\",\"fork\":false}")) + "]";
        github.expect(requestTo(URL)).andRespond(withSuccess(fullPage, MediaType.APPLICATION_JSON));
        github.expect(requestTo(URL.replace("&page=1", "&page=2")))
                .andRespond(withServerError());
        service.refresh();
        assertNull(service.getRepositories());
        github.verify();
    }
}
