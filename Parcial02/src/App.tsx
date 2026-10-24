import { useEffect } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";
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
import { flagOutline, statsChartOutline, trophyOutline } from "ionicons/icons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Missions from "./pages/Missions";
import Results from "./pages/Results";
import Ranking from "./pages/Ranking";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { MissionsProvider } from "./context/MissionsContext";

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
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  // Protección: sin sesión se vuelve al login
  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/missions" element={<Missions />} />
        <Route path="/tabs/results" element={<Results />} />
        <Route path="/tabs/ranking" element={<Ranking />} />
        <Route
          path="/tabs"
          element={<Navigate to="/tabs/missions" replace />}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="missions" href="/tabs/missions">
          <IonIcon aria-hidden="true" icon={flagOutline} />
          <IonLabel>Misiones</IonLabel>
        </IonTabButton>
        <IonTabButton tab="results" href="/tabs/results">
          <IonIcon aria-hidden="true" icon={statsChartOutline} />
          <IonLabel>Resultados</IonLabel>
        </IonTabButton>
        <IonTabButton tab="ranking" href="/tabs/ranking">
          <IonIcon aria-hidden="true" icon={trophyOutline} />
          <IonLabel>Ranking</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tabs/*" element={<Tabs />} />
        <Route
          path="/"
          element={<Navigate to={user ? "/tabs/missions" : "/login"} replace />}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <MissionsProvider>
        <AppRoutes />
      </MissionsProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
