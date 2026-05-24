export type TASK_STATE = "TODO" | "IN_PROGRESS" | "COMPLETED";

export const TASK_STATES: TASK_STATE[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

export const TASK_STATE_COLORS: Record<TASK_STATE, string> = {
  TODO: "#a243ef",
  IN_PROGRESS: "#2b7fff",
  COMPLETED: "#04b14b",
};
