import type { Task } from "../interfaces/Task";
import { apiClient } from "./apiClient";

export async function getAllTasks() {
  return apiClient
    .get(`/tasks`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function getTaskById(taskId: number) {
  return apiClient
    .get(`/tasks/${taskId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function createTask(task: Task) {
  return apiClient
    .post(`/tasks`, task)
    .then((res) => res.data)
    .catch(() => {});
}

export async function updateTask(taskId: number, task: Task) {
  return apiClient
    .put(`/tasks/${taskId}`, task)
    .then((res) => res.data)
    .catch(() => {});
}

export async function deleteTask(taskId: number) {
  return apiClient
    .delete(`/tasks/${taskId}`)
    .then((res) => res.data)
    .catch(() => {});
}
