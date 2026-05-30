import { apiClient } from "./apiClient";

export function getCv() {
  return apiClient
    .get("/api/curriculum-vitae")
    .then((res) => res.data)
    .catch();
}
