package fabrizio.lombardi.portfolio_backend.models.dtos;

import java.util.List;

import fabrizio.lombardi.portfolio_backend.services.GitHubService;

public record PortfolioDto(
        List<WorkAndTrainingDto> workAndTraining,
        List<SkillDto> skills,
        List<AiWorkflowDto> aiWorkflows,
        List<GitHubService.Repository> projects,
        boolean projectsAvailable,
        List<ReviewDto> reviews,
        Double rating) {
}
