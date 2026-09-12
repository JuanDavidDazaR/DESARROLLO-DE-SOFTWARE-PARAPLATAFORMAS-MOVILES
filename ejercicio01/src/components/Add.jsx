export default Add;

import { useState } from "react";

function Add({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [CC, setCC] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  const addPatient = () => {
    if (nombre.trim() === "" || apellido.trim() === "" || CC.trim() === "") {
      setError("Nombre, apellido y CC son obligatorios");
      return;
    }

    setError("");
    onAdd({ nombre: nombre, apellido: apellido, CC: CC, telefono: telefono });
    setNombre("");
    setApellido("");
    setCC("");
    setTelefono("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <input
        type="text"
        placeholder="CC"
        value={CC}
        onChange={(e) => setCC(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button onClick={addPatient}>Agregar paciente</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
