import { Edit3Icon, PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
import Scaffold from "../components/Scaffold";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { type Task, TaskPayload } from "../interfaces/Task";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../services/taskService";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import { Select, SelectItem } from "../components/ui/Select";
import {
  TASK_STATE_COLORS,
  TASK_STATES,
  type TASK_STATE,
} from "../interfaces/enums/TaskState";
import Pill from "../components/ui/Pill";
import { formatDateTime } from "../utils/formatDateTime";

export default function CrudDemo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>(TaskPayload);
  const [insertForm, setInsertForm] = useState(false);
  const [update, setUpdate] = useState(0);

  const fetchAllTasks = () => {
    getAllTasks()
      .then((data) => setTasks(data))
      .catch();
  };

  const handleTaskCreation = () => {
    createTask(newTask)
      .then(() => {
        setUpdate(update + 1);
        setInsertForm(false);
        setNewTask(TaskPayload);
      })
      .catch();
  };

  const handleTaskUpdate = (taskId: number) => {
    updateTask(taskId, newTask)
      .then(() => setUpdate(update + 1))
      .catch();
  };

  const handleTaskDelete = (taskId: number) => {
    deleteTask(taskId)
      .then(() => setUpdate(update + 1))
      .catch();
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task);
    setUpdate(task.id);
  };

  useEffect(() => {
    fetchAllTasks();
  }, [update]);

  return (
    <Scaffold>
      <section className="flex flex-col items-center gap-2">
        <h1>CRUD Demo</h1>
        <p className="text-foreground/60">
          Demo interattiva di operazioni CRUD (Create, Read, Update, Delete) per
          la gestione di task.
        </p>
      </section>

      <section className="w-full flex flex-col gap-5 items-end">
        {insertForm ? (
          <Card className="w-full">
            <div className="flex w-full justify-between">
              <h3>Crea nuovo task</h3>{" "}
              <Button onClick={() => setInsertForm(false)} variant="secondary">
                <XIcon />
                Annulla
              </Button>
            </div>

            <Input
              required
              label="Titolo"
              value={newTask.title}
              onChange={(v) => setNewTask({ ...newTask, title: v })}
            />

            <TextArea
              label="Descrizione"
              value={newTask.description}
              onChange={(v) => setNewTask({ ...newTask, description: v })}
            />

            <Select
              value={newTask.state}
              label="Stato"
              required
              onChange={(v) =>
                setNewTask({ ...newTask, state: v as TASK_STATE })
              }
            >
              {TASK_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </Select>

            <Button onClick={() => handleTaskCreation()}>
              <SaveIcon />
              Salva
            </Button>
          </Card>
        ) : (
          <Button onClick={() => setInsertForm(true)}>
            <PlusIcon />
            Nuova Task
          </Button>
        )}
      </section>

      <section className="w-full flex flex-col gap-5">
        {tasks?.map((t) =>
          update === t.id ? (
            <Card key={t.id} className="w-full">
              <h3>Modifica task</h3>{" "}
              <Input
                required
                label="Titolo"
                value={newTask.title}
                onChange={(v) => setNewTask({ ...newTask, title: v })}
              />
              <TextArea
                label="Descrizione"
                value={newTask.description}
                onChange={(v) => setNewTask({ ...newTask, description: v })}
              />
              <Select
                value={newTask.state}
                label="Stato"
                required
                onChange={(v) =>
                  setNewTask({ ...newTask, state: v as TASK_STATE })
                }
              >
                {TASK_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </Select>
              <div className="flex gap-5">
                <Button onClick={() => handleTaskUpdate(t.id)}>
                  <SaveIcon />
                  Salva
                </Button>
                <Button onClick={() => setUpdate(0)} variant="secondary">
                  <XIcon />
                  Annulla
                </Button>
              </div>
            </Card>
          ) : (
            <Card key={t.id} className="gap-2">
              <div className="w-full flex flex-row justify-between">
                <h2>{t.title}</h2>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="transparent"
                    onClick={() => handleEditTask(t)}
                  >
                    <Edit3Icon size={15} />
                  </Button>
                  <Button
                    variant="transparent"
                    className="hover:bg-primary"
                    onClick={() => handleTaskDelete(t.id)}
                  >
                    <Trash2Icon size={15} />
                  </Button>
                </div>
              </div>

              <Pill
                className="p-2 rounded-xl"
                style={{
                  color: TASK_STATE_COLORS[t.state],
                  borderColor: TASK_STATE_COLORS[t.state],
                  backgroundColor: `${TASK_STATE_COLORS[t.state]}1A`,
                }}
              >
                {t.state}
              </Pill>
              <span className="text-lg text-foreground/60">
                {t.description}
              </span>

              <span className="text-md text-foreground/60">
                Creato:{" "}
                {formatDateTime(t.creationDate || "", "it-IT", true, false)} {}
              </span>
            </Card>
          ),
        )}
      </section>
    </Scaffold>
  );
}
