import type { Argument } from "../interfaces/Argument";
import { apiClient } from "./apiClient";

export async function getAllArguments() {
  return apiClient
    .get<Argument[]>("/arguments")
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function getArgumentById(argumentId: number) {
  return apiClient
    .get<Argument>(`/arguments/${argumentId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function createArgument(argument: Argument) {
  return apiClient
    .post<Argument>("/arguments", argument)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function updateArgument(argumentId: number, argument: Argument) {
  return apiClient
    .put<Argument>(`/arguments/${argumentId}`, argument)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function deleteArgument(argumentId: number) {
  return apiClient
    .delete(`/arguments/${argumentId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export default {
  getAllArguments,
  getArgumentById,
  createArgument,
  updateArgument,
  deleteArgument,
};
