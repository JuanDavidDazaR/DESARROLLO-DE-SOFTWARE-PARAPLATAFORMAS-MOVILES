# DESARROLLO-DE-SOFTWARE-PARAPLATAFORMAS-MOVILES

---

## Ejercicio 1 - PWA de Pacientes

Aplicación web instalable (PWA) para que el personal de la clínica administre pacientes.

### Funcionalidades

- Login con usuario fijo, persistencia de sesión con `localStorage`
- Mensaje de error si las credenciales son incorrectas
- Cerrar sesión
- Lista de pacientes
- Formulario para agregar pacientes (nombre, apellido, CC, teléfono) con validación de campos obligatorios
- Buscador por nombre, apellido o CC (estado del buscador en el componente padre, lista filtrada enviada al hijo)
- Persistencia de pacientes en `localStorage`
- Instalable como PWA (manifest + service worker)

### Credenciales de prueba

- **Email:** user@mail.com
- **Contraseña:** 123

### Cómo correr el proyecto

```bash
cd ejercicio01
npm install
npm run dev
```

### URL en Render

[Pagina Ejercicio 1](https://desarrollo-de-software-paraplataformas-dhye.onrender.com/)

### Capturas de pantalla

```bash
cd screenshots
```

---

## Ejercicio 2 - App de Visitas Médicas (Ionic)

Aplicación móvil para que un médico consulte y actualice el estado de sus visitas del día.

### Funcionalidades

- Login con componentes de Ionic, `IonToast` para mostrar errores de credenciales
- Persistencia de sesión con `localStorage`
- Navegación con `IonTabs`: Visitas, Pacientes, Perfil
- Lista de visitas del día (paciente, hora, estado)
- Detalle de visita con opción de avanzar el estado: `pendiente → en_camino → finalizada`
- Persistencia de los cambios de estado en `localStorage`

### Credenciales de prueba

- **Email:** user@mail.com
- **Contraseña:** 123

### Cómo correr el proyecto

```bash
cd ejercicio02
npm install
ionic serve
```

### Capturas de pantalla

Estan en carpeta de screenchots

```bash
cd screenshots
```

---
