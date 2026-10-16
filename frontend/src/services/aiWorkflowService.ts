import { isAxiosError } from "axios";
import type { AiWorkflow } from "../interfaces/AiWorkflow";
import { apiClient } from "./apiClient";

export async function getAiWorkflows(admin = false): Promise<AiWorkflow[]> {
  const response = await apiClient.get<AiWorkflow[]>(`/ai-workflows${admin ? "/admin" : ""}`);
  if (!Array.isArray(response.data)) throw new Error("Risposta del server non valida.");
  return response.data;
}

export async function saveAiWorkflow(workflow: AiWorkflow): Promise<AiWorkflow> {
  const response = workflow.id
    ? await apiClient.put<AiWorkflow>(`/ai-workflows/${workflow.id}`, workflow)
    : await apiClient.post<AiWorkflow>("/ai-workflows", workflow);
  window.dispatchEvent(new Event("ai-workflows-updated"));
  return response.data;
}

export async function deleteAiWorkflow(id: number): Promise<void> {
  await apiClient.delete(`/ai-workflows/${id}`);
  window.dispatchEvent(new Event("ai-workflows-updated"));
}

export function workflowError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Sessione scaduta o permessi insufficienti. Accedi nuovamente come amministratore.";
    }
    if (error.response?.status === 400) {
      return "Controlla i campi: per pubblicare servono anche le conclusioni.";
    }
    if (error.response?.status === 404) return "Il workflow non è più disponibile. Ricarica l’elenco.";
  }
  return "Non è stato possibile completare l’operazione. Riprova tra poco.";
}
