import { useState } from "react";
import Login from "./components/Login.jsx";
import Patients from "./components/Patients.jsx";
import "./App.css";

function App() {
  const [logueado, setLogueado] = useState(
    localStorage.getItem("logged") === "true",
  );

  const handleLogin = () => {
    setLogueado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("logged");
    setLogueado(false);
  };

  if (!logueado) {
    return (
      <div className="App-container">
        <h1>Login</h1>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App-container">
      <h1>Lista de pacientes</h1>
      <button onClick={handleLogout}>Logout</button>
      <Patients />
    </div>
  );
}

export default App;
