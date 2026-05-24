import type { Rewiew } from "../interfaces/Rewiew";
import { apiClient } from "./apiClient";

export async function getRewiews() {
  return apiClient
    .get<Rewiew[]>("/api/reviews")
    .then((res) => res.data)
    .catch(() => {});
}

export async function getRewiewById(rewiewId: number) {
  return apiClient
    .get<Rewiew>(`/api/reviews/${rewiewId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function createRewiew(rewiew: Rewiew) {
  return apiClient
    .post<Rewiew>("/api/reviews", rewiew)
    .then((res) => res.data)
    .catch(() => {});
}

export async function updateRewiew(rewiewId: number, rewiew: Rewiew) {
  return apiClient
    .put<Rewiew>(`/api/reviews/${rewiewId}`, rewiew)
    .then((res) => res.data)
    .catch(() => {});
}

export async function deleteRewiew(rewiewId: number) {
  return apiClient
    .delete(`/api/reviews/${rewiewId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function getRating() {
  return apiClient
    .get<number>("/api/reviews/rating")
    .then((res) => res.data)
    .catch(() => {});
}
