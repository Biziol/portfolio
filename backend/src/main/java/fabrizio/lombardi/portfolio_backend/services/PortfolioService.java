package fabrizio.lombardi.portfolio_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fabrizio.lombardi.portfolio_backend.mappers.ReviewMapper;
import fabrizio.lombardi.portfolio_backend.mappers.SkillMapper;
import fabrizio.lombardi.portfolio_backend.mappers.WorkAndTrainingMapper;
import fabrizio.lombardi.portfolio_backend.models.dtos.PortfolioDto;

@Service
@Transactional(readOnly = true)
public class PortfolioService {
    private final WorkAndTrainingService workAndTrainingService;
    private final WorkAndTrainingMapper workAndTrainingMapper;
    private final SkillService skillService;
    private final SkillMapper skillMapper;
    private final AiWorkflowService aiWorkflowService;
    private final GitHubService gitHubService;
    private final ReviewService reviewService;
    private final ReviewMapper reviewMapper;

    public PortfolioService(WorkAndTrainingService workAndTrainingService,
            WorkAndTrainingMapper workAndTrainingMapper, SkillService skillService,
            SkillMapper skillMapper, AiWorkflowService aiWorkflowService,
            GitHubService gitHubService, ReviewService reviewService, ReviewMapper reviewMapper) {
        this.workAndTrainingService = workAndTrainingService;
        this.workAndTrainingMapper = workAndTrainingMapper;
        this.skillService = skillService;
        this.skillMapper = skillMapper;
        this.aiWorkflowService = aiWorkflowService;
        this.gitHubService = gitHubService;
        this.reviewService = reviewService;
        this.reviewMapper = reviewMapper;
    }

    public PortfolioDto getPublicContent() {
        var projects = gitHubService.getRepositories();
        return new PortfolioDto(
                workAndTrainingService.findAll().stream().map(workAndTrainingMapper::toDto).toList(),
                skillService.findAll().stream().map(skillMapper::toDto).toList(),
                aiWorkflowService.published(),
                projects == null ? List.of() : projects,
                projects != null,
                reviewService.findAll().stream().map(reviewMapper::toDto).toList(),
                reviewService.getRating());
    }
}
