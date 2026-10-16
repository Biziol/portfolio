package fabrizio.lombardi.portfolio_backend.services;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import fabrizio.lombardi.portfolio_backend.models.AiWorkflow;
import fabrizio.lombardi.portfolio_backend.models.AiWorkflowStep;
import fabrizio.lombardi.portfolio_backend.models.dtos.AiWorkflowDto;
import fabrizio.lombardi.portfolio_backend.repositories.AiWorkflowRepository;

@Service
@Transactional(readOnly = true)
public class AiWorkflowService {
    private final AiWorkflowRepository repository;

    public AiWorkflowService(AiWorkflowRepository repository) {
        this.repository = repository;
    }

    public List<AiWorkflowDto> published() {
        return repository.findAllByPublishedTrueOrderByIdDesc().stream().map(this::toDto).toList();
    }

    public List<AiWorkflowDto> all() {
        return repository.findAllByOrderByIdDesc().stream().map(this::toDto).toList();
    }

    @Transactional
    public AiWorkflowDto create(AiWorkflowDto payload) {
        return save(new AiWorkflow(), payload);
    }

    @Transactional
    public AiWorkflowDto update(Long id, AiWorkflowDto payload) {
        return save(find(id), payload);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }

    private AiWorkflow find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workflow non trovato"));
    }

    private AiWorkflowDto save(AiWorkflow entity, AiWorkflowDto payload) {
        if (payload.published() && blank(payload.conclusions())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Per pubblicare completa le conclusioni");
        }
        entity.setTitle(payload.title().trim());
        entity.setObjective(payload.objective().trim());
        entity.getTools().clear();
        entity.getTools().addAll(payload.tools().stream().map(String::trim).distinct().toList());
        entity.getSteps().clear();
        payload.steps().forEach(step -> entity.getSteps().add(
                new AiWorkflowStep(step.title().trim(), step.description().trim())));
        entity.setExample(clean(payload.example()));
        entity.setConclusions(clean(payload.conclusions()));
        entity.setPublished(payload.published());
        return toDto(repository.save(entity));
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String conclusions(AiWorkflow entity) {
        // Null identifies records saved before the unified conclusions field.
        // An intentionally empty new value must not restore the legacy text.
        if (entity.getConclusions() != null) return entity.getConclusions();
        return Stream.of(entity.getResult(), entity.getVerification())
                .filter(value -> !blank(value)).map(String::trim).collect(Collectors.joining("\n\n"));
    }

    private AiWorkflowDto toDto(AiWorkflow entity) {
        return new AiWorkflowDto(entity.getId(), entity.getTitle(), entity.getObjective(),
                List.copyOf(entity.getTools()), entity.getSteps().stream()
                        .map(step -> new AiWorkflowDto.Step(step.getTitle(), step.getDescription())).toList(),
                entity.getExample(), conclusions(entity), entity.isPublished());
    }
}
