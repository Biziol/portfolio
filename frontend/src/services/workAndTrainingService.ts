import type { WorkAndTraning } from "../interfaces/WorkAndTraning";
import { apiClient } from "./apiClient";

export async function getWorkAndTrainings() {
  return apiClient
    .get<WorkAndTraning[]>("/api/work-and-training")
    .then((res) => res.data)
    .catch();
}
