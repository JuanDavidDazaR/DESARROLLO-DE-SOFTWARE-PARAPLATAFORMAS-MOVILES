export default LogoutButton;
import { IonButton } from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";

function LogoutButton() {
  const { logout } = useAuthContext();
  return (
    <IonButton slot="end" onClick={() => logout()}>
      Logout
    </IonButton>
  );
}
