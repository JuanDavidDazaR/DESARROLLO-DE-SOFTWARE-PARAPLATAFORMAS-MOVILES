import { useState } from "react";
import { Route, Navigate } from "react-router-dom";
import {
  IonApp,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Login from "./components/Login";
import ContactDetail from "./pages/ContactDetail";
import ContactCreate from "./pages/ContactCreate";

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

const App: React.FC = () => {
  const [logueado, setLogueado] = useState<boolean>(
    localStorage.getItem("logged") === "true",
  );

  const handleLogin = (): void => {
    setLogueado(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("logged");
    setLogueado(false);
  };

  if (!logueado) {
    return (
      <IonApp>
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Login</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="App-container">
            <Login onLogin={handleLogin} />
          </IonContent>
        </IonPage>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" element={<Home onLogout={handleLogout} />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/detail" element={<ContactDetail />} />
          <Route path="/create" element={<ContactCreate />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
