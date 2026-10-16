import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { AiWorkflow } from "../../../interfaces/AiWorkflow";
import { emptyWorkflow } from "../../../interfaces/AiWorkflow";
import { cvWorkflowExample } from "../../../data/aiWorkflowExample";
import { deleteAiWorkflow, getAiWorkflows, saveAiWorkflow, workflowError } from "../../../services/aiWorkflowService";
import WorkflowCard from "../../../components/workflow/WorkflowCard";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Pill from "../../../components/ui/Pill";

function MarkdownField({ label, value, onChange, required = false, maxLength = 15000 }: {
  label: string; value: string; onChange: (value: string) => void; required?: boolean; maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      <span>{label}{required ? " *" : ""}</span>
      <textarea required={required} maxLength={maxLength} rows={5} value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl p-3 bg-muted-foreground w-full font-mono text-sm resize-y" />
    </label>
  );
}

export default function AiWorkflowsAdmin({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [workflows, setWorkflows] = useState<AiWorkflow[]>([]);
  const [editing, setEditing] = useState<AiWorkflow | null>(null);
  const [toolsText, setToolsText] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<AiWorkflow | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [dirty, setDirty] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => { if (deleting) deleteDialogRef.current?.showModal(); }, [deleting]);

  useEffect(() => {
    let active = true;
    void getAiWorkflows(true).then((data) => {
      if (active) { setWorkflows(data); setError(""); }
    }).catch((err: unknown) => { if (active) setError(workflowError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function openEditor(workflow: AiWorkflow) {
    if (dirty && !window.confirm("Abbandonare le modifiche non salvate?")) return;
    setEditing(structuredClone(workflow));
    setToolsText(workflow.tools.join(", "));
    setPreview(false);
    setError("");
    setNotice("");
    setDirty(false);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function patch(changes: Partial<AiWorkflow>) {
    setEditing((value) => value ? { ...value, ...changes } : value);
    setDirty(true);
  }

  function closeEditor() {
    if (dirty && !window.confirm("Abbandonare le modifiche non salvate?")) return;
    setEditing(null);
    setDirty(false);
    setError("");
  }

  function moveStep(index: number, offset: number) {
    if (!editing) return;
    const steps = [...editing.steps];
    [steps[index], steps[index + offset]] = [steps[index + offset], steps[index]];
    patch({ steps });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || busyRef.current) return;
    if (!editing.title.trim() || !editing.objective.trim() || editing.steps.some((step) => !step.title.trim() || !step.description.trim())) {
      setError("Compila titolo, obiettivo e tutti i passaggi."); return;
    }
    if (editing.published && !editing.conclusions.trim()) {
      setError("Per pubblicare completa le conclusioni."); return;
    }
    const tools = [...new Set(toolsText.split(",").map((tool) => tool.trim()).filter(Boolean))];
    if (tools.length > 20 || tools.some((tool) => tool.length > 80)) {
      setError("Inserisci al massimo 20 strumenti, ciascuno di massimo 80 caratteri."); return;
    }
    busyRef.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const saved = await saveAiWorkflow({ ...editing, tools });
      setWorkflows((items) => [saved, ...items.filter((item) => item.id !== saved.id)].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)));
      setEditing(saved);
      setToolsText(saved.tools.join(", "));
      setDirty(false);
      setNotice(saved.published ? "Workflow pubblicato." : "Bozza salvata. Non è visibile nel sito.");
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) { setError(workflowError(err)); }
    finally { busyRef.current = false; setBusy(false); }
  }

  async function remove() {
    if (!deleting?.id || busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(""); setNotice("");
    try {
      await deleteAiWorkflow(deleting.id);
      setWorkflows((items) => items.filter((item) => item.id !== deleting.id));
      if (editing?.id === deleting.id) { setEditing(null); setDirty(false); }
      setDeleting(null); setNotice("Workflow eliminato.");
    } catch (err) { setError(workflowError(err)); }
    finally { busyRef.current = false; setBusy(false); }
  }

  const previewData = editing && {
    ...editing,
    tools: [...new Set(toolsText.split(",").map((tool) => tool.trim()).filter(Boolean))],
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h1>Workflow IA</h1><p className="text-foreground/65 mt-2">Racconta come usi l’IA nei tuoi progetti e cosa verifichi personalmente.</p></div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" disabled={busy} onClick={() => openEditor(cvWorkflowExample())}>Parti dall’esempio CV</Button>
          <Button disabled={busy} onClick={() => openEditor(emptyWorkflow())}><PlusIcon aria-hidden="true" />Nuovo workflow</Button>
        </div>
      </div>
      {error && !editing && !deleting && <div role="alert" className="text-danger"><p>{error}</p><Button variant="secondary" onClick={() => { setLoading(true); setAttempt((value) => value + 1); }}>Ricarica elenco</Button></div>}
      {notice && !editing && <p role="status">{notice}</p>}
      {loading ? <p role="status">Caricamento workflow…</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="min-w-0 gap-3">
              <Pill>{workflow.published ? "Pubblicato" : "Bozza"}</Pill>
              <h2 className="break-words">{workflow.title}</h2>
              <p className="text-foreground/65 break-words whitespace-pre-wrap">{workflow.objective}</p>
              <div className="flex gap-2 flex-wrap mt-auto">
                <Button variant="tertiary" disabled={busy} onClick={() => openEditor(workflow)}>Modifica</Button>
                <Button variant="transparent" disabled={busy} onClick={() => { setError(""); setDeleting(workflow); }}><Trash2Icon aria-hidden="true" />Elimina</Button>
              </div>
            </Card>
          ))}
          {!workflows.length && <p className="text-foreground/65">Nessun workflow salvato. Crea il primo oppure adatta l’esempio del CV.</p>}
        </div>
      )}
      {editing && <div ref={editorRef} className="scroll-mt-28 w-full min-w-0">
        <Card className="w-full min-w-0 gap-5">
          <div className="w-full flex flex-wrap gap-3 items-center justify-between">
            <h2>{editing.id ? "Modifica workflow" : "Nuovo workflow"}</h2>
            <Button variant="secondary" disabled={busy} onClick={() => setPreview((value) => !value)}>{preview ? "Torna all’editor" : "Anteprima"}</Button>
          </div>
          <p className="text-sm text-foreground/65">Puoi usare Markdown nelle descrizioni: **grassetto**, elenchi, link e blocchi di codice. L’anteprima non pubblica le modifiche.</p>
          {error && !deleting && <p role="alert" className="text-danger">{error}</p>}
          {notice && <p role="status">{notice}</p>}
          {preview && previewData ? <WorkflowCard workflow={previewData} /> : (
            <form onSubmit={save} className="flex flex-col gap-5 w-full min-w-0">
              <fieldset disabled={busy} className="flex flex-col gap-5 min-w-0">
                <Input aria-label="Titolo del workflow" label="Titolo" required maxLength={160} value={editing.title} onChange={(title) => patch({ title })} />
                <label className="flex flex-col gap-2 text-sm font-medium">Obiettivo *
                  <textarea required maxLength={1000} rows={3} className="rounded-xl p-3 bg-muted-foreground w-full" value={editing.objective} onChange={(event) => patch({ objective: event.target.value })} />
                </label>
                <Input aria-label="Strumenti utilizzati" label="Strumenti separati da virgole" value={toolsText} onChange={(value) => { setToolsText(value); setDirty(true); }} placeholder="Codex, React, Spring Boot" />
                <h3>Passaggi del workflow</h3>
                {editing.steps.map((step, index) => (
                  <div key={index} className="border border-border rounded-xl p-4 flex flex-col gap-4 min-w-0">
                    <div className="flex justify-between gap-2 items-center flex-wrap">
                      <h4>Passaggio {index + 1}</h4>
                      <div className="flex gap-2">
                        <button type="button" aria-label={`Sposta passaggio ${index + 1} su`} disabled={index === 0} className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-30" onClick={() => moveStep(index, -1)}><ArrowUpIcon size={18} /></button>
                        <button type="button" aria-label={`Sposta passaggio ${index + 1} giù`} disabled={index === editing.steps.length - 1} className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-30" onClick={() => moveStep(index, 1)}><ArrowDownIcon size={18} /></button>
                        <button type="button" aria-label={`Rimuovi passaggio ${index + 1}`} disabled={editing.steps.length === 1} className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-30" onClick={() => patch({ steps: editing.steps.filter((_, i) => i !== index) })}><Trash2Icon size={18} /></button>
                      </div>
                    </div>
                    <Input aria-label={`Titolo passaggio ${index + 1}`} label="Titolo del passaggio" required maxLength={160} value={step.title} onChange={(title) => patch({ steps: editing.steps.map((item, i) => i === index ? { ...item, title } : item) })} />
                    <MarkdownField label={`Descrizione passaggio ${index + 1} (Markdown)`} required value={step.description} onChange={(description) => patch({ steps: editing.steps.map((item, i) => i === index ? { ...item, description } : item) })} />
                  </div>
                ))}
                <Button variant="tertiary" disabled={editing.steps.length >= 20} onClick={() => patch({ steps: [...editing.steps, { title: "", description: "" }] })}><PlusIcon aria-hidden="true" />Aggiungi passaggio</Button>
                <MarkdownField label="Caso concreto (Markdown)" value={editing.example} onChange={(example) => patch({ example })} />
                <MarkdownField label="Conclusioni (Markdown)" required={editing.published} maxLength={32000} value={editing.conclusions} onChange={(conclusions) => patch({ conclusions })} />
                <label className="flex gap-3 items-center"><input type="checkbox" checked={editing.published} onChange={(event) => patch({ published: event.target.checked })} />Pubblicato: visibile nel portfolio dopo il salvataggio</label>
                <div className="flex gap-3 flex-wrap">
                  <Button type="submit">{busy ? "Salvataggio…" : editing.published ? "Salva e pubblica" : "Salva bozza"}</Button>
                  <Button variant="secondary" onClick={closeEditor}>Chiudi editor</Button>
                </div>
              </fieldset>
            </form>
          )}
        </Card>
      </div>}
      {deleting && <dialog ref={deleteDialogRef} className="m-auto w-full max-w-lg border-0 bg-transparent p-5 text-foreground backdrop:bg-black/50" aria-labelledby="delete-workflow-title"
        onCancel={(event) => { event.preventDefault(); if (!busy) setDeleting(null); }}>
        <Card className="max-w-lg">
          <h2 id="delete-workflow-title">Eliminare il workflow?</h2>
          <p>“{deleting.title}” verrà eliminato definitivamente.</p>
          {error && <p role="alert" className="text-danger">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" disabled={busy} onClick={() => setDeleting(null)}>Annulla</Button>
            <Button disabled={busy} onClick={() => void remove()}>{busy ? "Eliminazione…" : "Conferma eliminazione"}</Button>
          </div>
        </Card>
      </dialog>}
    </div>
  );
}
