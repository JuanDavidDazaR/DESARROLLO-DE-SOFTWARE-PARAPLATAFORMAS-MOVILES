import { useState } from "react";
import cifar from "/public/cifar.jpg";
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
      <div className="App-container">
        <h1>Lista de contactos</h1>
        <Counter onFinish={terminarCarga} />
      </div>
    );
  }

  return (
    <div className="App-container">
      <h1>Lista de contactos</h1>
      <Contact />
      <img src={cifar} alt="cifar10" />
    </div>
  );
}

export default App;
