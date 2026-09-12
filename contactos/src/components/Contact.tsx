export default Contact;
import { IonList, IonItem, IonLabel, IonButton } from "@ionic/react";
import Delete from "./Delete";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Contacto {
  nombre: string;
  telefono: string;
}

function Contact() {
  const [myContacts, setMyContacts] = useState<Contacto[]>([
    { nombre: "Juan", telefono: "3211234567" },
    { nombre: "Maria", telefono: "3029876543" },
    { nombre: "Pedro", telefono: "3145957853" },
    { nombre: "Kevin", telefono: "3128624979" },
    { nombre: "Tetris", telefono: "3188230237" },
    { nombre: "Ruy Cabeção", telefono: "3134030691" },
    { nombre: "Poli", telefono: "320623e9139" },
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const nuevoContacto = (location.state as { nuevoContacto?: Contacto })
      ?.nuevoContacto;

    if (nuevoContacto) {
      setMyContacts((prev) => [...prev, nuevoContacto]);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const deleteContacto = (index: number): void => {
    const ActualizarContactos = [...myContacts];
    ActualizarContactos.splice(index, 1);
    setMyContacts(ActualizarContactos);
  };

  const irADetalle = (contacto: Contacto): void => {
    navigate("/detail", { state: { contact: contacto } });
  };

  return (
    <>
      <IonButton expand="block" onClick={() => navigate("/create")}>
        Crear contacto
      </IonButton>
      <IonList className="contact-list">
        {myContacts.map((item, index) => (
          <IonItem className="contact-item" key={index}>
            <IonLabel>
              {item.nombre} - {item.telefono}
            </IonLabel>
            <IonButton onClick={() => irADetalle(item)}>Detalle</IonButton>
            <Delete onDelete={() => deleteContacto(index)} />
          </IonItem>
        ))}
      </IonList>
    </>
  );
}
