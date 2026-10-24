# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

## Parcial 2 - App de Misiones (Ionic + React + Capacitor + Firebase)

Aplicación móvil donde usuarios reales se registran, inician sesión, completan misiones que usan los sensores del celular y ganan puntos. Incluye barra de progreso, pantalla de resultados, notificaciones locales y un ranking con el top 5 de usuarios.

### Misiones

| #   | Misión             | Qué hace                                                                                   | Plugin de Capacitor             | Puntos |
| --- | ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------- | ------ |
| 1   | Evidencia          | Toma una foto y se completa al guardar la imagen                                           | Camera + Filesystem             | 30     |
| 2   | Movimiento real    | Se completa al alejarse más de 50 m de la posición original                                | Geolocation                     | 50     |
| 3   | Permanencia activa | Se habilita al completar la misión 2. Hay que quedarse quieto 10 s; luego el celular vibra | Motion (acelerómetro) + Haptics | 40     |

Si el usuario mueve el celular durante la misión 3, la cuenta de 10 segundos se reinicia. La pantalla nunca se bloquea: hay contador visible y botón Cancelar.

### Funcionalidades

- Registro, login y logout con Firebase Authentication (usuarios reales)
- La sesión se recupera al recargar la app y las pantallas están protegidas
- Lista de misiones con estado (pendiente, completada o bloqueada) y puntos
- Puntos acumulados y barra de progreso con porcentaje y misiones completadas / total
- Pantalla de resultados: puntos totales, misiones completadas y estado general (sin iniciar, en progreso, completado)
- Notificaciones locales:
  - "Has completado una misión"
  - "Te falta 1 misión para completar"
- Ranking con el top 5 de usuarios reales, según su puntaje. Si el usuario no está en el top 5, se muestra su posición
- Persistencia en Firebase (Firestore) y en `localStorage`
- Envío de los puntos a Firebase cada vez que se completa una misión

### Formato de los datos guardados

Se guarda con el mismo formato en `localStorage` (clave `progress_<uid>`) y en Firestore (`users/<uid>`):

```json
{
  "points": 120,
  "missions": [
    { "id": 1, "completed": true },
    { "id": 2, "completed": true },
    { "id": 3, "completed": true }
  ]
}
```

En Firestore el documento también incluye `uid`, `email` y `updatedAt`, que se usan para el ranking.

## Cómo correr el proyecto

Las credenciales de Firebase **no están en el repositorio** por seguridad, así que hay que crear un proyecto propio.

### 1. Crear el proyecto en Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) y crea un proyecto.
2. En **Authentication → Método de acceso**, activa **Correo electrónico/contraseña**.
3. En **Firestore Database → Crear base de datos**, elige **Comenzar en modo de prueba**.
4. En **Configuración del proyecto → Tus apps**, registra una app web (`</>`) y copia el objeto `firebaseConfig`.

### 2. Crear el archivo de configuración

Crea `src/firebase/Config.ts` con tus valores:

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROYECTO.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

Este archivo está en el `.gitignore` y no se sube al repositorio.

### 3. Instalar y ejecutar en el navegador

```bash
npm install
ionic serve
```

Se abre en `http://localhost:8100`.

### 4. Ejecutar en un celular Android

```bash
ionic build
npx cap add android
npx cap sync
npx cap open android
```

Dentro de `android/app/src/main/AndroidManifest.xml`, y fuera de `<application>`, deben estar estos permisos:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

Cada vez que cambies el código: `ionic build && npx cap sync`.

---

## Cómo probar la app

1. **Usuarios:** registra varias cuentas (por ejemplo `ana@test.com`, `beto@test.com`...) para que el ranking tenga participantes.
2. **Misión 1:** toca "Tomar foto". Al guardarla se completan y suma 30 puntos.
3. **Misión 2 en el celular:** toca "Iniciar" y camina más de 50 m.
4. **Misión 2 en el navegador:** abre las herramientas de desarrollo (F12) → **Sensors → Location** y pon coordenadas personalizadas. Después de pulsar "Iniciar", cambia la latitud en `0.0005` (unos 55 m).
5. **Misión 3:** deja el celular quieto 10 segundos. Vibra y se completa. En el navegador de escritorio no hay acelerómetro, así que la cuenta corre sin interrupciones y no hay vibración.
6. **Resultados y ranking:** revisa las pestañas Resultados y Ranking.
7. **Repetir la prueba:** en Resultados, el botón "Reiniciar progreso" deja las misiones en cero.

Para ver los datos guardados:

- **Firebase:** Firestore → colección `users`
- **Local:** F12 → Application → Local Storage → `progress_<uid>`

---

## Decisiones tomadas sobre el enunciado

- **Distancia de la misión 2:** el enunciado menciona 50 m en la lista y "distancia > 30 m" como condición. Se usó 50 m, que cumple ambas. Se puede cambiar en la constante `MOVE_DISTANCE_METERS` de `src/context/MissionsContext.tsx`.
- **Puntos:** 30 + 50 + 40 = 120, igual al ejemplo del enunciado.
- **Ranking:** usa los usuarios reales de la colección `users` de Firestore. La fila del usuario actual se calcula con sus puntos locales, así siempre queda bien posicionado, incluso sin conexión.
- **Persistencia:** el progreso se guarda siempre en `localStorage` y se envía a Firestore. Al iniciar sesión se carga primero lo local y luego se actualiza con lo de Firebase si hay conexión.
