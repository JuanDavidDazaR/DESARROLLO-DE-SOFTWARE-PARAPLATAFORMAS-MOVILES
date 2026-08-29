import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Contact from "./components/Contact.jsx";
import Counter from "./components/Counter.jsx";

function App() {
  const [cargando, setCargando] = useState(true);

  const terminarCarga = () => {
    setCargando(false);
  };

  if (cargando) {
    return (
      <div>
        <h1>Lista de contactos</h1>
        <Counter onFinish={terminarCarga} />
      </div>
    );
  }

  return (
    <div>
      <h1>Lista de contactos</h1>
      <Contact />
    </div>
  );
}

export default App;
