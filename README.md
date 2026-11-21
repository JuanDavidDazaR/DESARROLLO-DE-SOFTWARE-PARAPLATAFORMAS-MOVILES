# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

# Challenge 09 — Buscador de GIFs con GIPHY

Aplicación móvil híbrida desarrollada con **Ionic + React + Capacitor** para el curso **Desarrollo de Software para Plataformas Móviles** (Universidad Autónoma de Occidente).

La app busca GIFs en la API de [GIPHY](https://developers.giphy.com/) mientras el usuario escribe y los muestra en una cuadrícula. Las peticiones HTTP se hacen con **axios** (instancia creada con `axios.create`) y la API key se guarda en **variables de entorno**.

---

## Funcionalidades

- Búsqueda de GIFs por texto con el endpoint `GET /gifs/search` de GIPHY.
- **Debounce (500 ms):** la búsqueda se lanza cuando el usuario deja de escribir, no con cada letra.
- **Cancelación de peticiones** con `AbortController`: si el texto cambia mientras hay una petición en curso, la anterior se cancela y no llegan resultados viejos.
- **Estados de la pantalla:** sin búsqueda, cargando, error, sin resultados y lista de GIFs.
- **Manejo de errores centralizado** con interceptores de axios: sin conexión, tiempo agotado, API key inválida (401/403), demasiadas peticiones (429) y errores del servidor (5xx), todos con mensajes claros.
- API key fuera del código, en un archivo `.env`.
- Imágenes con carga diferida (`loading="lazy"`) y cuadrícula tipo mosaico adaptable.

## Estructura del proyecto

```
src/
├── App.tsx                    # Rutas de la app
├── vite-env.d.ts              # Tipos de las variables de entorno
├── pages/
│   └── Home.tsx               # Pantalla principal con el buscador
├── components/
│   ├── GifGrid.tsx            # Cuadrícula de GIFs
│   └── GifGrid.css            # Estilos de la cuadrícula y de los estados
├── hooks/
│   ├── useDebounce.ts         # Retrasa la actualización del texto escrito
│   └── useGifSearch.ts        # Búsqueda con carga, error y cancelación
├── services/
│   ├── api.ts                 # Instancia de axios + interceptores
│   └── giphy.ts               # Función searchGifs
└── types/
    └── giphy.ts               # Tipos de la respuesta de GIPHY
```

---

## Instalación

### Requisitos

- Node.js 18 o superior
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio y un celular con depuración USB (o un emulador) para probar en Android

### 1. Clonar e instalar

```bash
git clone <URL-DEL-REPOSITORIO>
cd challenge09
npm install
```

### 2. Obtener la API key de GIPHY

1. Crea una cuenta en https://developers.giphy.com/
2. Ve a **Dashboard** → **Create an App** → elige **API**.
3. Copia la API Key.

### 3. Configurar las variables de entorno

Copia el archivo de ejemplo y pega tu key:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
VITE_GIPHY_API_KEY=PEGA_AQUI_TU_API_KEY
VITE_GIPHY_BASE_URL=https://api.giphy.com/v1
```

> El archivo `.env` está en el `.gitignore` y **no debe subirse** al repositorio. Si cambias el `.env`, reinicia `ionic serve` o vuelve a compilar.

---

## Ejecución

### En el navegador

```bash
ionic serve
```

### En Android

```bash
ionic build
npm install @capacitor/android      # solo si aún no está instalado (misma versión mayor que @capacitor/core)
npx cap add android                 # solo la primera vez
npx cap sync android
npx cap run android                 # o: npx cap open android y ejecutar desde Android Studio
```

Cada vez que cambies el código (o el `.env`) vuelve a correr `ionic build` y `npx cap sync android`, porque la API key se incluye en la app al compilar.

Capacitor ya incluye el permiso de internet en el proyecto Android, no hace falta agregar nada al `AndroidManifest.xml`.

---

## Cómo usar la app

1. Escribe una palabra en el buscador (por ejemplo, `smile`).
2. Medio segundo después de dejar de escribir aparecen los GIFs.
3. Toca un GIF para abrirlo en giphy.com.
4. Si borras el texto, la pantalla vuelve al estado inicial.
