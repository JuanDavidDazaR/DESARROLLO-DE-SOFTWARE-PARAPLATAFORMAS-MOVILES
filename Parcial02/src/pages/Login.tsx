export default Login;
import { useState, useEffect } from "react";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { user, loading, login } = useAuthContext();

  useEffect(() => {
    if (!loading && user) navigate("/tabs/missions", { replace: true });
  }, [user, loading]);

  const handleLogin = async () => {
    try {
      await login(email.trim(), password);
    } catch (error) {
      console.log("Error de Firebase:", error);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            placeholder="Email"
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            placeholder="Password"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleLogin}
        >
          Ingresar
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          onClick={() => navigate("/register")}
        >
          Crear cuenta
        </IonButton>
        <IonToast
          isOpen={showToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}
