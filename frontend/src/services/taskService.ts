import type { Task } from "../interfaces/Task";
import { apiClient } from "./apiClient";

export async function getAllTasks() {
  return apiClient
    .get(`/api/tasks`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function getTaskById(taskId: number) {
  return apiClient
    .get(`/api/tasks/${taskId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function createTask(task: Task) {
  return apiClient
    .post(`/api/tasks`, task)
    .then((res) => res.data)
    .catch(() => {});
}

export async function updateTask(taskId: number, task: Task) {
  return apiClient
    .put(`/api/tasks/${taskId}`, task)
    .then((res) => res.data)
    .catch(() => {});
}

export async function deleteTask(taskId: number) {
  return apiClient
    .delete(`/api/tasks/${taskId}`)
    .then((res) => res.data)
    .catch(() => {});
}
