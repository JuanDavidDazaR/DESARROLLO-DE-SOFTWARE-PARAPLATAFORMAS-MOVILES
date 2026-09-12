export default Patients;
import Add from "./Add.jsx";
import Search from "./Search.jsx";
import PatientList from "./PatientList.jsx";
import { useState, useEffect } from "react";

function Patients() {
  const [myPatients, setMyPatients] = useState(() => {
    const guardado = localStorage.getItem("patients");
    if (guardado) {
      return JSON.parse(guardado);
    }
    return [
      {
        nombre: "Juan",
        apellido: "Pérez",
        CC: "1445456265",
        telefono: "3211234567",
      },
      {
        nombre: "Maria",
        apellido: "Gómez",
        CC: "16588556266",
        telefono: "3029876543",
      },
      {
        nombre: "Pedro",
        apellido: "López",
        CC: "1625876267",
        telefono: "3145957853",
      },
    ];
  });

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(myPatients));
  }, [myPatients]);

  const addPatient = (nuevoPatient) => {
    setMyPatients([...myPatients, nuevoPatient]);
  };

  const deletePatient = (pacienteABorrar) => {
    const ActualizarPatients = myPatients.filter((p) => p !== pacienteABorrar);
    setMyPatients(ActualizarPatients);
  };

  const pacientesFiltrados = myPatients.filter((p) => {
    const texto = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.apellido.toLowerCase().includes(texto) ||
      p.CC.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <Search busqueda={busqueda} onBuscar={setBusqueda} />
      <PatientList pacientes={pacientesFiltrados} onDelete={deletePatient} />
      <Add onAdd={addPatient} />
    </>
  );
}
