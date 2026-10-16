export interface WorkflowStep {
  title: string;
  description: string;
}

export interface AiWorkflow {
  id?: number;
  title: string;
  objective: string;
  tools: string[];
  steps: WorkflowStep[];
  example: string;
  conclusions: string;
  published: boolean;
}

export function emptyWorkflow(): AiWorkflow {
  return {
    title: "", objective: "", tools: [],
    steps: [{ title: "", description: "" }],
    example: "", conclusions: "", published: false,
  };
}
