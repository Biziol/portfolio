package fabrizio.lombardi.portfolio_backend.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class AiWorkflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 1000)
    private String objective;

    @ElementCollection
    @CollectionTable(name = "ai_workflow_tool", joinColumns = @JoinColumn(name = "workflow_id"))
    @OrderColumn(name = "tool_order")
    @Column(name = "tool_name", nullable = false, length = 80)
    private List<String> tools = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ai_workflow_step", joinColumns = @JoinColumn(name = "workflow_id"))
    @OrderColumn(name = "step_order")
    private List<AiWorkflowStep> steps = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String example;

    @Column(columnDefinition = "LONGTEXT")
    private String conclusions;

    // Legacy columns retained so existing content can be merged on read.
    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(columnDefinition = "TEXT")
    private String verification;

    @Column(nullable = false)
    private boolean published;
}
