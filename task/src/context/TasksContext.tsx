import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TaskItem {
  tarea: string;
  completada: boolean;
}

interface TasksContextType {
  tasks: TaskItem[];
  addTask: (nueva: TaskItem) => void;
  deleteTask: (index: number) => void;
  updateTask: (index: number, tarea: TaskItem) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { tarea: "Estudiar para el examen de bases de datos", completada: false },
    { tarea: "Hacer el challenge de Ionic", completada: false },
    { tarea: "Comprar mercado", completada: true },
    { tarea: "Llamar al dentista", completada: false },
  ]);

  const addTask = (nueva: TaskItem): void => {
    setTasks([...tasks, nueva]);
  };

  const deleteTask = (index: number): void => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, tarea: TaskItem): void => {
    setTasks(tasks.map((t, i) => (i === index ? tarea : t)));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks debe usarse dentro de TasksProvider");
  }
  return context;
}
