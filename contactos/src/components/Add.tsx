export default Add;
import { useState } from "react";
import { IonItem, IonInput, IonButton } from "@ionic/react";

interface Contacto {
  nombre: string;
  telefono: string;
}

interface AddProps {
  onAdd: (nuevoContacto: Contacto) => void;
}

function Add({ onAdd }: AddProps) {
  const [contacto, setContacto] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");

  const addContacto = (): void => {
    onAdd({ nombre: contacto, telefono: telefono });
    setContacto("");
    setTelefono("");
  };

  return (
    <div className="add-form">
      <IonItem>
        <IonInput
          placeholder="Nombre"
          value={contacto}
          onIonInput={(e) => setContacto(e.detail.value ?? "")}
        />
      </IonItem>
      <IonItem>
        <IonInput
          placeholder="Teléfono"
          value={telefono}
          onIonInput={(e) => setTelefono(e.detail.value ?? "")}
        />
      </IonItem>
      <IonButton expand="block" onClick={addContacto}>
        Agregar contacto
      </IonButton>
    </div>
  );
}
