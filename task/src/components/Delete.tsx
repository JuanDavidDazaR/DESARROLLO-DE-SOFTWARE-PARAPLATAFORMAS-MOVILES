export default Delete;
import { IonButton } from "@ionic/react";

function Delete({ onDelete }: { onDelete: () => void }) {
  return <IonButton onClick={onDelete}>Eliminar</IonButton>;
}
