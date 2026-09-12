import { useState } from "react";
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
import { calendar, people, person } from "ionicons/icons";
import Visitas from "./pages/Visitas";
import Pacientes from "./pages/Pacientes";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Detail from "./pages/Detail";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [logueado, setLogueado] = useState(
    localStorage.getItem("logged") === "true",
  );

  const handleLogin = (): void => {
    setLogueado(true);
  };

  if (!logueado) {
    return (
      <IonApp>
        <Login onLogin={handleLogin} />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/Visitas" element={<Visitas />} />
            <Route path="/Pacientes" element={<Pacientes />} />
            <Route path="/Perfil" element={<Perfil />} />
            <Route path="/detalle" element={<Detail />} />
            <Route path="/" element={<Navigate to="/Perfil" replace />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/Visitas">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>Visitas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/Pacientes">
              <IonIcon aria-hidden="true" icon={people} />
              <IonLabel>Pacientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/Perfil">
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
