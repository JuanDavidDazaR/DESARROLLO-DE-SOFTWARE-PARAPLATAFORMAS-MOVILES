# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

# Challenge 08 — App de Mapas con Sensores

Aplicación móvil híbrida desarrollada con **Ionic + React + Capacitor** para el curso **Desarrollo de Software para Plataformas Móviles** (Universidad Autónoma de Occidente).

La app muestra la ubicación del usuario en un mapa, registra su recorrido en tiempo real y combina varios sensores y servicios del teléfono: GPS, acelerómetro, red, batería, vibración, cámara, notificaciones y sistema de archivos.


## Estructura del proyecto

```
src/
├── App.tsx                      # Rutas y pestañas (Mapa / Historial)
├── main.tsx                     # Entrada de la app (+ elementos web de la cámara)
├── components/
│   ├── MapView.tsx              # Pantalla principal: junta todos los sensores
│   └── MapComponent.css         # Estilos del mapa
├── pages/
│   ├── MapPage.tsx              # Pestaña del mapa
│   └── History.tsx              # Pestaña del historial de recorridos
├── hooks/
│   ├── useGeolocation.ts        # GPS: ubicación actual y seguimiento
│   ├── useNetwork.ts            # Estado de la conexión (a)
│   ├── useBattery.ts            # Nivel de batería (f)
│   ├── useNotifications.ts      # Notificaciones locales (g)
│   ├── useMotion.ts             # Acelerómetro (b)
│   └── usePhotoWatermark.ts     # Foto con marca de agua (d)
├── services/
│   ├── opencage.ts              # Dirección y lugares cercanos (h)
│   └── trackingStorage.ts       # Guardar/leer recorridos en JSON (c)
└── utils/
    ├── geo.ts                   # Distancia (Haversine) y velocidad
    └── leafletIcon.ts           # Arreglo del ícono del marcador
```

---

## Instalación

### Requisitos

- Node.js 18 o superior
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (para compilar en Android) y un celular con depuración USB, o un emulador

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>
cd challenge08

# 2. Instalar dependencias
npm install
```

### Configurar la API key de OpenCage

1. Crea una cuenta gratis en https://opencagedata.com y copia tu API key.
2. Abre `src/services/opencage.ts` y reemplaza el valor:

```ts
const API_KEY = "TU_API_KEY_OPENCAGE";
```

> No subas tu API key a un repositorio público.

---

## Ejecución

### En el navegador

```bash
ionic serve
```

En el navegador funcionan el mapa, el tracking, la conexión, las notificaciones, la dirección y los lugares cercanos. Para simular movimiento: DevTools (F12) → ⋮ → *More tools* → **Sensors** → *Location*.

El acelerómetro y la vibración solo funcionan en un celular real.

### En Android

```bash
ionic build
npx cap sync android
npx cap run android      
```

Cada vez que cambies el código debes repetir `ionic build` y `npx cap sync`.

### Permisos de Android

En `android/app/src/main/AndroidManifest.xml` (dentro de `<manifest>`, fuera de `<application>`):

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Al abrir la app por primera vez, acepta los permisos de ubicación, cámara y notificaciones.

---

## Cómo usar la app

1. Al abrir, la app pide permiso de ubicación y muestra el mapa con tu posición.
2. **Iniciar** comienza el tracking (el teléfono vibra) y dibuja tu recorrido. **Detener** lo termina y lo guarda.
3. **Modo automático:** activa el interruptor y el tracking arranca solo cuando te mueves y se detiene tras 60 s quieto.
4. **Obtener dirección** muestra la dirección de tu posición actual.
5. **Lugares cercanos:** elige una categoría y pulsa el botón para ver los lugares en el mapa y en la lista.
6. **Foto con ubicación:** toma una foto con tus coordenadas, fecha y dirección escritas en la imagen.
7. En la pestaña **Historial** verás tus recorridos agrupados por día. Toca uno para ver su ruta en el mapa.

---

## Valores configurables



---

## Limitaciones conocidas

- El seguimiento de ubicación funciona **solo con la app abierta**; `@capacitor/geolocation` no rastrea en segundo plano.
- OpenCage es un servicio de geocodificación, no un buscador de negocios. La búsqueda de lugares cercanos usa `proximity` para sesgar los resultados, por lo que no siempre devuelve negocios reales.
- Dentro de edificios el GPS es impreciso; la velocidad se ignora si la precisión es peor a 50 m.
- Sin internet no cargan los tiles del mapa, la dirección ni los lugares cercanos.

---

## Autor

- **Nombre:** _Tu nombre_
- **Curso:** Desarrollo de Software para Plataformas Móviles
- **Profesor:** Jonathan López Londoño
- **Universidad:** Universidad Autónoma de Occidente (UAO)
