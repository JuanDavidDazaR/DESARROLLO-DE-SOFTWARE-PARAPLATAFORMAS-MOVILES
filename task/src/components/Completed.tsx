export default Completed;
import { IonButton } from "@ionic/react";

function Completed({ onComplete }: { onComplete: () => void }) {
  return <IonButton onClick={onComplete}>Completar</IonButton>;
}
