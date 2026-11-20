import { Navigate, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { mapOutline, timeOutline } from "ionicons/icons";
import MapPage from "./pages/MapPage";
import History from "./pages/History";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/map" element={<MapPage />} />
        <Route path="/tabs/history" element={<History />} />
        <Route path="/tabs" element={<Navigate to="/tabs/map" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="map" href="/tabs/map">
          <IonIcon aria-hidden="true" icon={mapOutline} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>
        <IonTabButton tab="history" href="/tabs/history">
          <IonIcon aria-hidden="true" icon={timeOutline} />
          <IonLabel>Historial</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/tabs/*" element={<Tabs />} />
        <Route path="/" element={<Navigate to="/tabs/map" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
