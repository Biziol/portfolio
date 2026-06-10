import type { WorkAndTraning } from "../interfaces/WorkAndTraning";
import { apiClient } from "./apiClient";

export async function getWorkAndTrainings() {
  return apiClient
    .get<WorkAndTraning[]>("/work-and-training")
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}
