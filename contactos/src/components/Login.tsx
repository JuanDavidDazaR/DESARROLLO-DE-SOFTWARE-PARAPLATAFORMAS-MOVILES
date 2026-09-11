export default Login;
import { useState } from "react";
import { IonItem, IonInput, IonButton } from "@ionic/react";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleLogin = (): void => {
    if (email === "user@mail.com" && password === "123") {
      localStorage.setItem("logged", "true");
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-form">
      <IonItem>
        <IonInput
          placeholder="Email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
      </IonItem>
      <IonItem>
        <IonInput
          placeholder="Password"
          type="password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
      </IonItem>
      <IonButton expand="block" onClick={handleLogin}>
        Login
      </IonButton>
      {error && (
        <p style={{ color: "red" }}>Usuario o contraseña incorrectos</p>
      )}
    </div>
  );
}
