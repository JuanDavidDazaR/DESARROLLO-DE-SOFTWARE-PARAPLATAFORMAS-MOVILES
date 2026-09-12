export default Search;

function Search({ busqueda, onBuscar }) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre, apellido o CC"
      value={busqueda}
      onChange={(e) => onBuscar(e.target.value)}
    />
  );
}
