import type { TASK_STATE } from "./enums/TaskState";

export interface Task {
  id: number;
  title: string;
  description: string;
  state: TASK_STATE;
  creationDate: string;
}

export const TaskPayload: Task = {
  id: 0,
  title: "",
  description: "",
  state: "TODO",
  creationDate: "",
};
