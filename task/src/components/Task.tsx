export default TaskManager;
import { useState } from "react";
import { IonList, IonItem, IonLabel } from "@ionic/react";
import Add from "./Add";
import Completed from "./Completed";
import Delete from "./Delete";

interface Task {
  tarea: string;
  completada: boolean;
}

function TaskManager() {
  const [myTasks, setMyTasks] = useState<Task[]>([
    { tarea: "Estudiar para el examen de bases de datos", completada: false },
    { tarea: "Hacer el challenge de Ionic", completada: false },
    { tarea: "Comprar mercado", completada: true },
    { tarea: "Llamar al dentista", completada: false },
  ]);

  const addTask = (nuevaTask: Task): void => {
    setMyTasks([...myTasks, nuevaTask]);
  };

  const deleteTask = (index: number): void => {
    const actualizarTasks = [...myTasks];
    actualizarTasks.splice(index, 1);
    setMyTasks(actualizarTasks);
  };

  const completarTask = (index: number): void => {
    const actualizarTasks = [...myTasks];
    actualizarTasks[index].completada = true;
    setMyTasks(actualizarTasks);
  };

  const pendientes = myTasks.filter((task) => !task.completada);
  const completadas = myTasks.filter((task) => task.completada);

  return (
    <>
      <h2>Pendientes</h2>
      <IonList className="task-list">
        {pendientes.map((task) => (
          <IonItem className="task-item" key={myTasks.indexOf(task)}>
            <IonLabel>{task.tarea}</IonLabel>
            <Completed
              onComplete={() => completarTask(myTasks.indexOf(task))}
            />
            <Delete onDelete={() => deleteTask(myTasks.indexOf(task))} />
          </IonItem>
        ))}
      </IonList>

      <h2>Completadas</h2>
      <IonList className="task-list">
        {completadas.map((task) => (
          <IonItem className="task-item" key={myTasks.indexOf(task)}>
            <IonLabel>{task.tarea}</IonLabel>
            <Delete onDelete={() => deleteTask(myTasks.indexOf(task))} />
          </IonItem>
        ))}
      </IonList>

      <Add onAdd={addTask} />
    </>
  );
}
