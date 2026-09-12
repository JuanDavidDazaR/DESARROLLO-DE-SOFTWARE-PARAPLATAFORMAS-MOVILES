export default PatientList;
import Delete from "./Delete.jsx";

function PatientList({ pacientes, onDelete }) {
  return (
    <ul>
      {pacientes.map((item, index) => (
        <li key={index}>
          {item.nombre} - {item.apellido} - {item.CC} - {item.telefono}
          <Delete onDelete={() => onDelete(item)} />
        </li>
      ))}
    </ul>
  );
}
