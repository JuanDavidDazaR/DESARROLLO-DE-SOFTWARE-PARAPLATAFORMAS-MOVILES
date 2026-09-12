export default Detail;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Visita {
  id: number;
  paciente: string;
  hora: string;
  estado: string;
}

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visita, setVisita] = useState<Visita | undefined>(undefined);

  useEffect(() => {
    const visitaRecibida = (location.state as { visita: Visita })?.visita;
    if (visitaRecibida) {
      setVisita(visitaRecibida);
    }
  }, [location.state]);

  const siguienteEstado = (): void => {
    if (!visita) return;

    let nuevoEstado = visita.estado;
    if (visita.estado === "pendiente") nuevoEstado = "en_camino";
    else if (visita.estado === "en_camino") nuevoEstado = "finalizada";

    const visitaActualizada = { ...visita, estado: nuevoEstado };
    setVisita(visitaActualizada);

    const guardado = localStorage.getItem("visitas");
    const visitas: Visita[] = guardado ? JSON.parse(guardado) : [];
    const actualizadas = visitas.map((v) =>
      v.id === visita.id ? visitaActualizada : v,
    );
    localStorage.setItem("visitas", JSON.stringify(actualizadas));
  };

  if (!visita) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>No se encontró la visita.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle de visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Paciente: {visita.paciente}</h2>
        <p>Hora: {visita.hora}</p>
        <p>Estado actual: {visita.estado}</p>
        {visita.estado !== "finalizada" && (
          <IonButton expand="block" onClick={siguienteEstado}>
            Avanzar estado
          </IonButton>
        )}
        <IonButton expand="block" fill="outline" onClick={() => navigate(-1)}>
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
