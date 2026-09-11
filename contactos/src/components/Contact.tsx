export default Contact;
import { IonList, IonItem, IonLabel } from "@ionic/react";
import Add from "./Add";
import Delete from "./Delete";
import { useState } from "react";

interface Contacto {
  nombre: string;
  telefono: string;
}

function Contact() {
  const [myContacts, setMyContacts] = useState<Contacto[]>([
    { nombre: "Juan", telefono: "3211234567" },
    { nombre: "Maria", telefono: "3029876543" },
    { nombre: "Pedro", telefono: "3145957853" },
    { nombre: "Kevin", telefono: "3128624979" },
    { nombre: "Tetris", telefono: "3188230237" },
    { nombre: "Ruy Cabeção", telefono: "3134030691" },
    { nombre: "Poli", telefono: "320623e9139" },
  ]);

  const addContacto = (nuevoContacto: Contacto): void => {
    setMyContacts([...myContacts, nuevoContacto]);
  };

  const deleteContacto = (index: number): void => {
    const ActualizarContactos = [...myContacts];
    ActualizarContactos.splice(index, 1);
    setMyContacts(ActualizarContactos);
  };

  return (
    <>
      <IonList className="contact-list">
        {myContacts.map((item, index) => (
          <IonItem className="contact-item" key={index}>
            <IonLabel>
              {item.nombre} - {item.telefono}
            </IonLabel>
            <Delete onDelete={() => deleteContacto(index)} />
          </IonItem>
        ))}
      </IonList>
      <Add onAdd={addContacto} />
    </>
  );
}
