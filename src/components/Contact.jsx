export default Contact;
import Add from "./add.jsx";
import Delete from "./Delete.jsx";
import { useState } from "react";

function Contact() {
  const [myContacts, setMyContacts] = useState([
    { nombre: "Juan", telefono: "3211234567" },
    { nombre: "Maria", telefono: "3029876543" },
    { nombre: "Pedro", telefono: "3145957853" },
  ]);

  const addContacto = (nuevoContacto) => {
    setMyContacts([...myContacts, nuevoContacto]);
  };

  const deleteContacto = (index) => {
    const ActualizarContactos = [...myContacts];
    ActualizarContactos.splice(index, 1);
    setMyContacts(ActualizarContactos);
  };

  return (
    <>
      <ul>
        {myContacts.map((item, index) => (
          <li key={index}>
            {item.nombre} - {item.telefono}
            <Delete onDelete={() => deleteContacto(index)} />
          </li>
        ))}
      </ul>
      <Add onAdd={addContacto} />
    </>
  );
}
