import type { Rewiew } from "../interfaces/Rewiew";
import { apiClient } from "./apiClient";

export async function getRewiews() {
  return apiClient
    .get<Rewiew[]>("/reviews")
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function getRewiewById(rewiewId: number) {
  return apiClient
    .get<Rewiew>(`/reviews/${rewiewId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function createRewiew(rewiew: Rewiew) {
  return apiClient
    .post<Rewiew>("/reviews", rewiew)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function updateRewiew(rewiewId: number, rewiew: Rewiew) {
  return apiClient
    .put<Rewiew>(`/reviews/${rewiewId}`, rewiew)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function deleteRewiew(rewiewId: number) {
  return apiClient
    .delete(`/reviews/${rewiewId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function getRating() {
  return apiClient
    .get<number>("/reviews/rating")
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}
