package fabrizio.lombardi.portfolio_backend;

import fabrizio.lombardi.portfolio_backend.repositories.AiWorkflowRepository;
import fabrizio.lombardi.portfolio_backend.models.AiWorkflow;
import fabrizio.lombardi.portfolio_backend.models.AiWorkflowStep;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AiWorkflowTests {
    @Autowired MockMvc mvc;
    @Autowired AiWorkflowRepository repository;

    private static final String DRAFT = """
        {"title":"CV con IA","objective":"Generare un CV aggiornato",
         "tools":["Codex","React"],
         "steps":[{"title":"Pianificare","description":"**Analisi** del problema"},
                  {"title":"Verificare","description":"Controllo il PDF"}],
         "example":"Download del CV","conclusions":"PDF A4 con dati verificati",
         "published":false}
        """;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
    }

    @Test
    void draftsStayPrivateUntilPublishedAndCanBeUnpublished() throws Exception {
        mvc.perform(post("/api/ai-workflows").with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isCreated());
        Long id = repository.findAll().getFirst().getId();
        mvc.perform(get("/api/ai-workflows")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/api/ai-workflows/admin").with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].published").value(false));

        String published = DRAFT.replace("\"published\":false", "\"published\":true");
        mvc.perform(put("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(published))
                .andExpect(status().isOk());
        mvc.perform(get("/api/ai-workflows"))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].steps[0].title").value("Pianificare"))
                .andExpect(jsonPath("$[0].steps[1].title").value("Verificare"))
                .andExpect(jsonPath("$[0].tools[1]").value("React"));

        mvc.perform(put("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isOk());
        mvc.perform(get("/api/ai-workflows")).andExpect(jsonPath("$.length()").value(0));
        mvc.perform(delete("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN")))
                .andExpect(status().isNoContent());
        mvc.perform(put("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isNotFound());
    }

    @Test
    void onlyAdminsCanReadDraftsOrChangeWorkflows() throws Exception {
        mvc.perform(get("/api/ai-workflows/admin")).andExpect(status().isForbidden());
        mvc.perform(get("/api/ai-workflows/admin").with(user("visitor").roles("USER")))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/ai-workflows").contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isForbidden());
        mvc.perform(put("/api/ai-workflows/1").with(user("visitor").roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/ai-workflows/1").with(user("visitor").roles("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void mergesLegacyContentAndPreservesEditsToConclusions() throws Exception {
        AiWorkflow legacy = new AiWorkflow();
        legacy.setTitle("Workflow esistente");
        legacy.setObjective("Conservare i contenuti");
        legacy.getSteps().add(new AiWorkflowStep("Revisione", "Controllo il codice"));
        legacy.setResult("Risultato precedente");
        legacy.setVerification("Verifica precedente");
        legacy.setPublished(true);
        Long id = repository.save(legacy).getId();

        mvc.perform(get("/api/ai-workflows"))
                .andExpect(jsonPath("$[0].conclusions").value("Risultato precedente\n\nVerifica precedente"));
        mvc.perform(get("/api/ai-workflows/admin").with(user("admin").roles("ADMIN")))
                .andExpect(jsonPath("$[0].conclusions").value("Risultato precedente\n\nVerifica precedente"));

        mvc.perform(put("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conclusions").value("PDF A4 con dati verificati"));
        mvc.perform(put("/api/ai-workflows/" + id).with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(DRAFT.replace("PDF A4 con dati verificati", "")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/ai-workflows/admin").with(user("admin").roles("ADMIN")))
                .andExpect(jsonPath("$[0].conclusions").value(""));
    }

    @Test
    void validatesContentAndRequiresConclusionsBeforePublishing() throws Exception {
        mvc.perform(post("/api/ai-workflows").with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT.replace("\"CV con IA\"", "\" \"")))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/ai-workflows").with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT.replace("\"Pianificare\"", "null")))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/ai-workflows").with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON).content(DRAFT.replace("\"published\":false", "\"published\":true")
                                .replace("\"PDF A4 con dati verificati\"", "\"\"")))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/ai-workflows/admin").with(user("admin").roles("ADMIN")))
                .andExpect(jsonPath("$.length()").value(0));
    }
}
