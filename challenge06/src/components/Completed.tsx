import { IonButton } from "@ionic/react";

function Completed({
  onComplete,
  disabled,
}: {
  onComplete: () => void;
  disabled?: boolean;
}) {
  return (
    <IonButton fill="clear" onClick={onComplete} disabled={disabled}>
      Completar
    </IonButton>
  );
}

export default Completed;
