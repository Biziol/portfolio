import { FlaskConicalIcon, SparklesIcon, ClipboardCheckIcon } from "lucide-react";
import type { AiWorkflow } from "../../interfaces/AiWorkflow";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import MarkdownContent from "./MarkdownContent";

export default function WorkflowCard({ workflow }: { workflow: AiWorkflow }) {
  return (
    <article className="w-full min-w-0">
      <Card className="gap-6 w-full min-w-0">
        <div className="flex items-center gap-3">
          <SparklesIcon className="text-primary shrink-0" aria-hidden="true" />
          <h2 className="break-words">{workflow.title || "Titolo del workflow"}</h2>
        </div>
        <p className="text-foreground/65 whitespace-pre-wrap break-words">{workflow.objective || "Descrivi l’obiettivo del lavoro."}</p>
        {workflow.tools.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Strumenti utilizzati">
            {workflow.tools.map((tool, i) => <li key={i}><Pill>{tool}</Pill></li>)}
          </ul>
        )}
        <ol className="w-full min-w-0 space-y-5" aria-label="Passaggi del workflow">
          {workflow.steps.map((step, i) => (
            <li key={i} className="flex gap-3 min-w-0">
              <div className="flex flex-col items-center shrink-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">{i + 1}</span>
                {i < workflow.steps.length - 1 && <span className="w-px bg-primary/30 grow mt-2" />}
              </div>
              <div className="min-w-0 flex-1 pb-3">
                <h3 className="mb-2 break-words">{step.title || `Passaggio ${i + 1}`}</h3>
                <MarkdownContent>{step.description}</MarkdownContent>
              </div>
            </li>
          ))}
        </ol>
        {workflow.example && (
          <div className="w-full min-w-0 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 mb-3"><FlaskConicalIcon className="text-primary" aria-hidden="true" />Un caso concreto</h3>
            <MarkdownContent>{workflow.example}</MarkdownContent>
          </div>
        )}
        {workflow.conclusions && (
          <div className="w-full min-w-0 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 mb-3"><ClipboardCheckIcon className="text-primary shrink-0" aria-hidden="true" />Conclusioni</h3>
            <MarkdownContent>{workflow.conclusions}</MarkdownContent>
          </div>
        )}
      </Card>
    </article>
  );
}
