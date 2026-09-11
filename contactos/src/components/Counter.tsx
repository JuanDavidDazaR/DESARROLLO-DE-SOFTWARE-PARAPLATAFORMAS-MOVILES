export default Counter;
import { useEffect, useState } from "react";
import { IonSpinner, IonText } from "@ionic/react";

interface CounterProps {
  onFinish: () => void;
}

function Counter({ onFinish }: CounterProps) {
  const [segundos, setSegundos] = useState<number>(3);

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
    };
  }, []);

  return (
    <div className="counter">
      <IonSpinner name="crescent" />
      <IonText>
        <p>Cargando contactos... {segundos}</p>
      </IonText>
    </div>
  );
}
