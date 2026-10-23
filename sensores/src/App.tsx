import { Navigate, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import GeolocationPage from "./pages/GeolocationPage";
import CameraPage from "./pages/CameraPage";
import AccelerometerPage from "./pages/AccelerometerPage";
import DevicePage from "./pages/DevicePage";
import HapticsPage from "./pages/HapticsPage";
import FilesystemPage from "./pages/FilesystemPage";
import LocalNotificationsPage from "./pages/LocalNotificationsPage";
import PushNotificationsPage from "./pages/PushNotificationsPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" element={<Home />} />
        <Route path="/geolocation" element={<GeolocationPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/accelerometer" element={<AccelerometerPage />} />
        <Route path="/device" element={<DevicePage />} />
        <Route path="/haptics" element={<HapticsPage />} />
        <Route path="/filesystem" element={<FilesystemPage />} />
        <Route
          path="/local-notifications"
          element={<LocalNotificationsPage />}
        />
        <Route path="/push-notifications" element={<PushNotificationsPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
