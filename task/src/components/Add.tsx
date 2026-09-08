export default Add;
import { useState } from "react";
import { IonItem, IonInput, IonButton } from "@ionic/react";

interface Task {
  tarea: string;
  completada: boolean;
}

interface AddProps {
  onAdd: (nuevaTask: Task) => void;
}

function Add({ onAdd }: AddProps) {
  const [tarea, setTarea] = useState<string>("");

  const addTask = (): void => {
    onAdd({ tarea: tarea, completada: false });
    setTarea("");
  };

  return (
    <div className="add-form">
      <IonItem>
        <IonInput
          placeholder="Tarea"
          value={tarea}
          onIonInput={(e) => setTarea(e.detail.value ?? "")}
        />
      </IonItem>
      <IonButton expand="block" onClick={addTask}>
        Agregar tarea
      </IonButton>
    </div>
  );
}
