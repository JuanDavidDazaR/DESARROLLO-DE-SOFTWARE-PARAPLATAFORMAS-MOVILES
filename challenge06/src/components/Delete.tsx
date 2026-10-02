export default Delete;
import { IonButton } from "@ionic/react";

function Delete({
  onDelete,
  disabled,
}: {
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <IonButton onClick={onDelete} disabled={disabled}>
      Eliminar
    </IonButton>
  );
}
