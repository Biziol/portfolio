package fabrizio.lombardi.portfolio_backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabrizio.lombardi.portfolio_backend.models.dtos.PortfolioDto;
import fabrizio.lombardi.portfolio_backend.services.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final PortfolioService service;

    public PortfolioController(PortfolioService service) {
        this.service = service;
    }

    @Operation(summary = "Restituisce i contenuti dinamici pubblici del portfolio",
            description = "Esperienze e formazione con argomenti, skill, workflow IA pubblicati, "
                    + "progetti dalla cache GitHub e recensioni con media. "
                    + "I testi statici del frontend non sono inclusi. "
                    + "projectsAvailable=false indica che la cache GitHub non è ancora disponibile.")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public PortfolioDto get() {
        return service.getPublicContent();
    }
}
