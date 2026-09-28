# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

## Challenge 05 - Task Manager con Firebase (Ionic + React + TypeScript)

Aplicación de gestión de tareas construida con Ionic, React y TypeScript. Usa Firebase Authentication para el registro, inicio y cierre de sesión, Context API para compartir el estado entre páginas, y custom hooks para encapsular la lógica de Firebase.

## Cómo correr el proyecto

El proyecto se encuentra dentro de la carpeta `task/`. Las credenciales de Firebase **no están incluidas en el repositorio** por seguridad, así que hay que crear un proyecto propio en Firebase siguiendo estos pasos.

### 1. Crear el proyecto en Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **Crear un proyecto** y sigue el asistente.
3. Ya creado el proyecto, ve a **Authentication** en el menú de la izquierda.
4. Entra a la pestaña **Método de acceso**, elige **Correo electrónico/contraseña**, actívalo y guarda.

### 2. Obtener las credenciales

1. En el menú de la izquierda, haz clic en el ícono de engranaje y entra a **Configuración del proyecto**.
2. Baja hasta **Tus apps** y haz clic en el ícono web `</>` para agregar una app web.
3. Ponle un nombre y haz clic en **Registrar app**.
4. En el paso **Agrega el SDK de Firebase**, selecciona **Usar npm** y copia el objeto `firebaseConfig`.

### 3. Crear el archivo de configuración

1. Clona el repositorio y cámbiate a la rama del challenge:

```bash
   git checkout Challenge05
   cd task
```

2. Copia la plantilla con el nombre que espera la app:

```bash
   cp src/firebase/Config.example.js src/firebase/Config.js
```

3. Abre `src/firebase/Config.js` y reemplaza los valores de `firebaseConfig` por los que copiaste en el paso anterior.

### 4. Instalar y ejecutar

```bash
npm install
ionic serve
```

La app se abre en `http://localhost:8100`. Crea una cuenta desde **Crear cuenta** e inicia sesión.
