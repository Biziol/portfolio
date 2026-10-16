import { useEffect, useState } from "react";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import WorkflowCard from "../components/workflow/WorkflowCard";
import type { AiWorkflow } from "../interfaces/AiWorkflow";
import { getAiWorkflows } from "../services/aiWorkflowService";

export default function AiWorkflows() {
  const [workflows, setWorkflows] = useState<AiWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getAiWorkflows();
        if (active) setWorkflows(data.filter((item) => item.published));
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    window.addEventListener("ai-workflows-updated", load);
    return () => { active = false; window.removeEventListener("ai-workflows-updated", load); };
  }, [attempt]);

  return (
    <Scaffold id="/ai-workflow">
      <div className="text-center max-w-2xl space-y-3">
        <h1>Come uso l’IA</h1>
        <p className="text-foreground/65">Dal problema alla soluzione: strumenti, decisioni e verifiche nei miei progetti.</p>
      </div>
      {loading ? <p role="status">Caricamento workflow…</p> : error ? (
        <Card className="w-full items-center">
          <p role="alert">Non è stato possibile caricare i workflow.</p>
          <Button onClick={() => setAttempt((value) => value + 1)}>Riprova</Button>
        </Card>
      ) : workflows.length ? (
        <div className="w-full space-y-8">{workflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)}</div>
      ) : <Card className="w-full"><p className="text-foreground/65">I casi pratici sul mio utilizzo dell’IA saranno disponibili qui.</p></Card>}
    </Scaffold>
  );
}
