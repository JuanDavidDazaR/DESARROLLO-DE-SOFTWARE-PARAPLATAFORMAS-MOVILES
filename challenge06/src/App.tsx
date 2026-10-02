import { useState, useEffect } from "react";
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
import {
  peopleOutline,
  checkboxOutline,
  nutritionOutline,
} from "ionicons/icons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import Fruits from "./pages/Fruits";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

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
        <Route path="/tabs/contacts" element={<Contacts />} />
        <Route path="/tabs/tasks" element={<Tasks />} />
        <Route path="/tabs/fruits" element={<Fruits />} />
        <Route
          path="/tabs"
          element={<Navigate to="/tabs/contacts" replace />}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="contacts" href="/tabs/contacts">
          <IonIcon aria-hidden="true" icon={peopleOutline} />
          <IonLabel>Contactos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tasks" href="/tabs/tasks">
          <IonIcon aria-hidden="true" icon={checkboxOutline} />
          <IonLabel>Tareas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="fruits" href="/tabs/fruits">
          <IonIcon aria-hidden="true" icon={nutritionOutline} />
          <IonLabel>Frutas</IonLabel>
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;
