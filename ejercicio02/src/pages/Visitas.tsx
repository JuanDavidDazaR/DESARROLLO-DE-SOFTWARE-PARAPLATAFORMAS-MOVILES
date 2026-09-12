export default Visitas;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Visita {
  id: number;
  paciente: string;
  hora: string;
  estado: string;
}

function Visitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const guardado = localStorage.getItem("visitas");
    if (!guardado) {
      const iniciales: Visita[] = [
        { id: 1, paciente: "Juan Pérez", hora: "08:00", estado: "pendiente" },
        { id: 2, paciente: "Maria Gómez", hora: "09:30", estado: "en_camino" },
        { id: 3, paciente: "Pedro López", hora: "11:00", estado: "finalizada" },
      ];
      setVisitas(iniciales);
      localStorage.setItem("visitas", JSON.stringify(iniciales));
    }
  }, []);

  useIonViewWillEnter(() => {
    const guardado = localStorage.getItem("visitas");
    if (guardado) {
      setVisitas(JSON.parse(guardado));
    }
  });

  const irADetalle = (visita: Visita): void => {
    navigate("/detalle", { state: { visita } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {visitas.map((v) => (
            <IonItem key={v.id} button onClick={() => irADetalle(v)}>
              <IonLabel>
                <h2>{v.paciente}</h2>
                <p>
                  Hora: {v.hora} - Estado: {v.estado}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
