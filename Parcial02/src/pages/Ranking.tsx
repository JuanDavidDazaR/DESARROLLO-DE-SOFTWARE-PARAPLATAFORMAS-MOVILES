export default Ranking;
import { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonText,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "../context/AuthContext";
import { useMissions } from "../context/MissionsContext";
import LogoutButton from "../components/LogoutButton";

interface RankUser {
  uid: string;
  email: string;
  points: number;
}

const nombre = (email: string) => email.split("@")[0];

function Ranking() {
  const { user } = useAuthContext();
  const { progress } = useMissions();
  const [others, setOthers] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(
        query(collection(db, "users"), orderBy("points", "desc")),
      );
      setOthers(
        snap.docs.map((d) => ({
          uid: d.id,
          email: d.data().email ?? "anonimo",
          points: d.data().points ?? 0,
        })),
      );
    } catch {
      setError("No se pudo cargar el ranking. Revisa tu conexión.");
    }
    setLoading(false);
  };

  useIonViewWillEnter(() => {
    load();
  });

  // Tu fila usa tus puntos locales, así siempre quedas bien posicionado
  const me: RankUser = {
    uid: user?.uid ?? "me",
    email: user?.email ?? "tu",
    points: progress.points,
  };

  const all = [...others.filter((u) => u.uid !== me.uid), me].sort(
    (a, b) => b.points - a.points,
  );
  const top5 = all.slice(0, 5);
  const myPos = all.findIndex((u) => u.uid === me.uid) + 1;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ranking</IonTitle>
          <LogoutButton />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading && (
          <div className="ion-padding ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        )}
        {error && (
          <IonText color="danger">
            <p className="ion-padding">{error}</p>
          </IonText>
        )}

        <IonList>
          {top5.map((u, i) => {
            const isMe = u.uid === me.uid;
            return (
              <IonItem key={u.uid}>
                <IonBadge slot="start" color={i === 0 ? "warning" : "medium"}>
                  {i + 1}
                </IonBadge>
                <IonLabel style={{ fontWeight: isMe ? "bold" : "normal" }}>
                  {nombre(u.email)}
                  {isMe ? " (tú)" : ""}
                </IonLabel>
                <IonBadge slot="end" color={isMe ? "success" : "primary"}>
                  {u.points} pts
                </IonBadge>
              </IonItem>
            );
          })}
        </IonList>

        {myPos > 5 && (
          <IonText>
            <p className="ion-padding">
              Tu posición: #{myPos} con {me.points} pts
            </p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
}
