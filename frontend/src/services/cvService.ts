import { apiClient } from "./apiClient";

export function getCv() {
  return apiClient
    .get("/curriculum-vitae")
    .then((res) => res.data)
    .catch();
}
