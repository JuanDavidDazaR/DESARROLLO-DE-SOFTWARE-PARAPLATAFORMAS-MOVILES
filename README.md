# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

## Challenge 06 - Contactos, Tareas y Frutas con Firebase y Dexie (Ionic + React + TypeScript)

Aplicación móvil construida con Ionic, React y TypeScript que reúne los challenges anteriores en una sola app con login real y navegación por pestañas (`IonTabs`). Cada módulo guarda sus datos en una fuente distinta:

| Módulo    | Dónde se guardan los datos                 | Hook                    |
| --------- | ------------------------------------------ | ----------------------- |
| Contactos | Cloud Firestore                            | `useCollection`         |
| Tareas    | Firebase Realtime Database                 | `useRealTimeCollection` |
| Frutas    | Dexie (IndexedDB, local en el dispositivo) | `useDexie`              |

Además, la app detecta si hay conexión a internet y deshabilita las acciones de Contactos y Tareas cuando no la hay.

### Funcionalidades

**Autenticación (Firebase Authentication)**

- Registro, inicio y cierre de sesión con correo y contraseña
- La sesión se recupera al recargar la página
- Rutas protegidas: sin sesión, las pestañas redirigen al login
- Botón de Logout en las tres pestañas

**Contactos (Firestore)**

- Ver la lista de contactos
- Crear un contacto en una página independiente
- Ver el detalle de un contacto
- Editar un contacto desde su detalle
- Eliminar contactos

**Tareas (Realtime Database)**

- Lista separada en pendientes y completadas
- Agregar una tarea en una página independiente
- Marcar una tarea como completada
- Ver el detalle de una tarea y editar su texto y su estado
- Eliminar tareas

**Frutas (Dexie)**

- Lista que se actualiza en tiempo real con `useLiveQuery`
- Agregar y eliminar frutas
- Buscador por nombre
- Funciona sin conexión, porque los datos son locales

**Detección de red (`@capacitor/network`)**

- El hook `useNetwork` informa si hay conexión y la actualiza al instante cuando cambia
- Sin conexión, los botones de crear, editar, completar y eliminar de Contactos y Tareas quedan deshabilitados y aparece un aviso
- Frutas sigue funcionando normal

## Cómo correr el proyecto

El proyecto está en la carpeta `challenge06/`. Las credenciales de Firebase **no están incluidas en el repositorio** por seguridad, así que hay que crear un proyecto propio en Firebase siguiendo estos pasos.

### 1. Crear el proyecto en Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **Crear un proyecto** y sigue el asistente.

### 2. Activar los tres servicios

1. **Authentication:** ve a **Authentication → Método de acceso**, elige **Correo electrónico/contraseña**, actívalo y guarda.
2. **Firestore:** ve a **Firestore Database → Crear base de datos** y elige **Comenzar en modo de prueba**.
3. **Realtime Database:** ve a **Realtime Database → Crear base de datos** y elige **Comenzar en modo de prueba**. Copia la URL de la base de datos que aparece arriba, la necesitarás en el siguiente paso.

El modo de prueba permite leer y escribir sin restricciones durante 30 días. Pasado ese plazo hay que actualizar las reglas de seguridad.

### 3. Obtener las credenciales

1. Entra a **Configuración del proyecto** (ícono de engranaje).
2. Baja hasta **Tus apps** y haz clic en el ícono web `</>`.
3. Ponle un nombre y haz clic en **Registrar app**.
4. Selecciona **Usar npm** y copia el objeto `firebaseConfig`.

### 4. Crear el archivo de configuración

1. Clona el repositorio y cámbiate a la rama del challenge:

```bash
   git checkout Challenge06
   cd challenge06
```

2. Copia la plantilla con el nombre que espera la app:

```bash
   cp src/firebase/Config.example.js src/firebase/Config.js
```

3. Abre `src/firebase/Config.js` y reemplaza los valores de `firebaseConfig` por los que copiaste. Agrega también la `databaseURL` de Realtime Database.

`Config.js` está en el `.gitignore`, así que no se sube al repositorio.

### 5. Instalar y ejecutar

```bash
npm install
ionic serve
```

La app se abre en `http://localhost:8100`. Crea una cuenta desde **Crear cuenta** e inicia sesión.

### Probar la detección de red

En el navegador, abre las herramientas de desarrollo (F12), ve a la pestaña **Network** y activa **Offline**. Los botones de Contactos y Tareas se deshabilitan; al reactivar la conexión vuelven a funcionar sin recargar. Frutas funciona en ambos casos.
