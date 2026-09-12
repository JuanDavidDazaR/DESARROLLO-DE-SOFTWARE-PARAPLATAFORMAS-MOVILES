export default Login;
import { useState } from "react";
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

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = (): void => {
    if (email === "user@mail.com" && password === "123") {
      localStorage.setItem("logged", "true");
      onLogin();
    } else {
      setShowToast(true);
    }
    setEmail("");
    setPassword("");
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
        <IonButton expand="block" onClick={handleLogin}>
          Login
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
