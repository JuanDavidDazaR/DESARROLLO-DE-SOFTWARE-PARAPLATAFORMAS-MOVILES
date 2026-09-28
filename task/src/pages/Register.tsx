export default Register;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigate("/task");
    } catch (error) {
      console.log("Error de Firebase:", error);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            placeholder="Email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            placeholder="Password (mínimo 6 caracteres)"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleRegister}>
          Crear cuenta
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          onClick={() => navigate("/login")}
        >
          Ya tengo cuenta
        </IonButton>
        <IonToast
          isOpen={showToast}
          message="No se pudo crear la cuenta. Revisa el email y que la contraseña tenga al menos 6 caracteres."
          duration={3000}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}
