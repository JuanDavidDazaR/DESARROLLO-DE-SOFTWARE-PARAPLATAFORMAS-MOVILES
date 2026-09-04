export default Add;

import { useState } from "react";

function Add({ onAdd }) {
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");

  const addContacto = () => {
    onAdd({ nombre: contacto, telefono: telefono });
    setContacto("");
    setTelefono("");
  };

  return (
    <div className="add-form">
      <input
        type="text"
        placeholder="Nombre"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button onClick={addContacto}>Agregar contacto</button>
    </div>
  );
}
