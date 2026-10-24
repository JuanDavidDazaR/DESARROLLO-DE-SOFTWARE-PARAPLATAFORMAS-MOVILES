export default MissionCard;
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
} from "@ionic/react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  points: number;
  completed: boolean;
  locked?: boolean;
  children?: ReactNode;
}

function MissionCard({
  title,
  description,
  points,
  completed,
  locked = false,
  children,
}: Props) {
  const estado = completed ? "Completada" : locked ? "Bloqueada" : "Pendiente";
  const color = completed ? "success" : locked ? "medium" : "warning";

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>{points} puntos</IonCardSubtitle>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonChip color={color}>
          <IonLabel>{estado}</IonLabel>
        </IonChip>
        <p>{description}</p>
        {!locked && children}
      </IonCardContent>
    </IonCard>
  );
}
