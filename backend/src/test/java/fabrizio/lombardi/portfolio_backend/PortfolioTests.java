package fabrizio.lombardi.portfolio_backend;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import fabrizio.lombardi.portfolio_backend.models.*;
import fabrizio.lombardi.portfolio_backend.models.enums.SkillField;
import fabrizio.lombardi.portfolio_backend.models.enums.WorkType;
import fabrizio.lombardi.portfolio_backend.repositories.*;
import fabrizio.lombardi.portfolio_backend.services.GitHubService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PortfolioTests {
    @Autowired MockMvc mvc;
    @Autowired WorkAndTrainingRepository experiences;
    @Autowired ArgumentRepository arguments;
    @Autowired SkillRepository skills;
    @Autowired AiWorkflowRepository workflows;
    @Autowired ReviewRepository reviews;
    @MockitoBean GitHubService gitHubService;

    @Test
    void returnsPublicContentWithoutAuthenticationAndKeepsDraftsPrivate() throws Exception {
        var experience = new WorkAndTraining();
        experience.setTitle("Sviluppatore Full Stack");
        experience.setInstituteOrCompany("Azienda");
        experience.setStartDate(LocalDate.of(2025, 1, 15));
        experience.setType(WorkType.WORK);
        experiences.save(experience);
        arguments.save(new Argument(0, "Web app Spring Boot e React", experience));
        var training = new WorkAndTraining();
        training.setTitle("ITS");
        training.setInstituteOrCompany("Istituto");
        training.setStartDate(LocalDate.of(2023, 9, 1));
        training.setType(WorkType.TRAINING);
        experiences.save(training);
        skills.save(new Skill(0, "React", SkillField.FRONTEND));
        var published = new AiWorkflow();
        published.setTitle("Workflow pubblico");
        published.setObjective("Verificare il codice");
        published.getTools().add("Codex");
        published.getSteps().add(new AiWorkflowStep("Test", "Eseguire i test"));
        published.setConclusions("Verifica completata");
        published.setPublished(true);
        workflows.save(published);
        var draft = new AiWorkflow();
        draft.setTitle("Bozza privata");
        draft.setObjective("In lavorazione");
        workflows.save(draft);
        reviews.save(new Review(0, "Visitatore", 4, "Ottimo portfolio", LocalDateTime.now()));
        when(gitHubService.getRepositories()).thenReturn(List.of(
                new GitHubService.Repository(1, "portfolio", "https://github.com/Biziol/portfolio",
                        "Portfolio personale", List.of("react"))));

        mvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.workAndTraining.length()").value(2))
                .andExpect(jsonPath("$.workAndTraining[0].startDate").value("2025-01-15"))
                .andExpect(jsonPath("$.workAndTraining[0].arguments[0].text").value("Web app Spring Boot e React"))
                .andExpect(jsonPath("$.workAndTraining[1].type").value("TRAINING"))
                .andExpect(jsonPath("$.skills[0].name").value("React"))
                .andExpect(jsonPath("$.aiWorkflows.length()").value(1))
                .andExpect(jsonPath("$.aiWorkflows[0].title").value("Workflow pubblico"))
                .andExpect(jsonPath("$.aiWorkflows[0].tools[0]").value("Codex"))
                .andExpect(jsonPath("$.aiWorkflows[0].steps[0].description").value("Eseguire i test"))
                .andExpect(jsonPath("$.projectsAvailable").value(true))
                .andExpect(jsonPath("$.projects[0].title").value("portfolio"))
                .andExpect(jsonPath("$.reviews[0].comment").value("Ottimo portfolio"))
                .andExpect(jsonPath("$.rating").value(4.0));
        verify(gitHubService, never()).refresh();
    }

    @Test
    void returnsEmptySectionsWhenDatabaseAndGitHubCacheAreEmpty() throws Exception {
        when(gitHubService.getRepositories()).thenReturn(null);
        mvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workAndTraining").isEmpty())
                .andExpect(jsonPath("$.skills").isEmpty())
                .andExpect(jsonPath("$.aiWorkflows").isEmpty())
                .andExpect(jsonPath("$.reviews").isEmpty())
                .andExpect(jsonPath("$.rating").value(0.0))
                .andExpect(jsonPath("$.projects").isEmpty())
                .andExpect(jsonPath("$.projectsAvailable").value(false));
        verify(gitHubService, never()).refresh();
    }

    @Test
    void distinguishesAnAvailableEmptyGitHubSnapshotFromUnavailableCache() throws Exception {
        when(gitHubService.getRepositories()).thenReturn(List.of());
        mvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projects").isEmpty())
                .andExpect(jsonPath("$.projectsAvailable").value(true));
    }
}
