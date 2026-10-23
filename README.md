# Sensores (Challenge 07)

Aplicación móvil hecha con **Ionic React + Capacitor** que muestra cómo usar los sensores y funciones nativas del teléfono. La pantalla principal tiene un botón por cada sensor, y cada botón abre una página dedicada que lo implementa con un _custom hook_.

## Funcionalidades

| Página                 | Plugin de Capacitor              | Qué hace                                                                                              |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Geolocalización        | `@capacitor/geolocation`         | Obtiene la posición actual y la sigue en tiempo real (iniciar y detener).                             |
| Cámara                 | `@capacitor/camera`              | Toma una foto y la muestra en pantalla.                                                               |
| Acelerómetro           | `@capacitor/motion`              | Muestra los ejes X, Y, Z, la magnitud, si hay movimiento y detecta sacudidas.                         |
| Dispositivo            | `@capacitor/device`              | Muestra batería, modelo, plataforma, sistema operativo e identificador.                               |
| Haptics                | `@capacitor/haptics`             | Impactos suaves y fuertes, notificaciones de éxito y error, y vibración.                              |
| Archivos               | `@capacitor/filesystem`          | Escribe, lee, lista y elimina un archivo JSON en el dispositivo.                                      |
| Notificaciones locales | `@capacitor/local-notifications` | Pide permisos, envía una notificación inmediata y programa otra a 5 segundos.                         |
| Notificaciones push    | `@capacitor/push-notifications`  | Pide permisos, registra el dispositivo en Firebase y muestra el token y las notificaciones recibidas. |

## Requisitos

- Node.js 18 o superior y npm
- Android Studio con el Android SDK instalado
- **JDK 21** (Capacitor 8 no funciona con versiones más nuevas ni más viejas)
- Un celular Android con depuración USB activada, o un emulador con Google Play

## Instalación

```bash
git clone https://github.com/JuanDavidDazaR/DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES.git
cd DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES/sensores
npm install
```

## Configuración local

Estos archivos no están en el repositorio y cada persona debe crear los suyos.

**1. SDK de Android.** Crea `android/local.properties` con la ruta de tu SDK:

```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

**2. Java 21.** Si tu Java por defecto no es el 21, agrega en `android/gradle.properties` la ruta de tu JDK 21 (esa línea es local, no la subas):

```properties
org.gradle.java.home=C:\\ruta\\a\\jdk-21
```

**3. Firebase (solo para notificaciones push).**

- Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com) y agrega una app Android con el mismo `appId` que aparece en `capacitor.config.ts`.
- Descarga `google-services.json` y colócalo en `android/app/`.
- Crea `src/firebase/Config.js` con los datos de tu proyecto de Firebase.

Sin estos dos archivos todo funciona menos las notificaciones push.

**4. Permisos de Android.** Ya declarados en `android/app/src/main/AndroidManifest.xml`: cámara, ubicación (aproximada y precisa), vibración y notificaciones. Si cambias de proyecto, deben estar ahí.

## Ejecutar en el navegador (desarrollo)

```bash
npm run dev
```

Sirve para ver la interfaz, pero los sensores nativos solo funcionan correctamente en un dispositivo.

## Desplegar en un celular Android

Cada vez que cambies código, repite estos pasos desde la carpeta `sensores/`:

```bash
npm run build
npx cap sync android
npx cap run android
```

Elige tu dispositivo cuando lo pida la terminal. Para abrir el proyecto en Android Studio:

```bash
npx cap open android
```

Para generar un APK de depuración sin instalarlo:

```bash
cd android
./gradlew assembleDebug
```

El archivo queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Probar las notificaciones push

1. Abre la app, entra a **Notificaciones push** y toca **Activar Push**. Acepta el permiso.
2. Copia el token que aparece en pantalla. También se imprime en la consola (`adb logcat | grep "Capacitor/Console"`).
3. En Firebase, ve a **Messaging**, crea una campaña y usa **Enviar mensaje de prueba**, pegando el token.

Si la app está abierta, la notificación aparece en la página. Si está en segundo plano, llega a la barra de notificaciones.
