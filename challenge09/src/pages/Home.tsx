import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import GifGrid from "../components/GifGrid";
import { useDebounce } from "../hooks/useDebounce";
import { useGifSearch } from "../hooks/useGifSearch";
import "../components/GifGrid.css";

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);
  const { gifs, loading, error } = useGifSearch(debouncedText);

  const hasSearch = debouncedText.trim().length > 0;
  const noResults = hasSearch && !loading && !error && gifs.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscador de GIFs</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={text}
            debounce={0}
            placeholder="Busca un GIF (ej: smile)"
            onIonInput={(e) => setText(e.detail.value ?? "")}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {!hasSearch && !loading && (
          <div className="gif-state">
            <IonText color="medium">
              <p>Escribe algo para buscar GIFs en GIPHY.</p>
            </IonText>
          </div>
        )}

        {loading && (
          <div className="gif-state">
            <IonSpinner name="crescent" />
            <IonText color="medium">Buscando...</IonText>
          </div>
        )}

        {error && (
          <div className="gif-state">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          </div>
        )}

        {noResults && (
          <div className="gif-state">
            <IonText color="medium">
              <p>No hay resultados para “{debouncedText}”.</p>
            </IonText>
          </div>
        )}

        {!loading && !error && gifs.length > 0 && <GifGrid gifs={gifs} />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
