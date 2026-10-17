import { apiClient } from "./apiClient";

export interface GitHubRepository {
  id: number;
  title: string;
  html_url: string;
  description: string | null;
  topics: string[];
}

export async function getPublicRepositories(): Promise<GitHubRepository[]> {
  const response = await apiClient.get<GitHubRepository[]>("/github/repositories");
  if (!Array.isArray(response.data)) {
    throw new Error("Risposta del server non valida.");
  }
  return response.data;
}
