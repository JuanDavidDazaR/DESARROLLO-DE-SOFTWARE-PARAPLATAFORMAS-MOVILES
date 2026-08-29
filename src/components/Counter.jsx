export default Counter;

import { useEffect, useState } from "react";

function Counter({ onFinish }) {
  const [segundos, setSegundos] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundos((s) => {
        if (s - 1 === 0) {
          onFinish();
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log("Intervalo limpiado");
    };
  }, []);

  return <p>Cargando contactos... {segundos}</p>;
}
