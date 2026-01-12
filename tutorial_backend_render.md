# Tutorial Paso a Paso: Desplegar Backend en Render

Este tutorial te guiará para desplegar tu backend (Node.js/Express) en la plataforma Render.com de forma gratuita.

## 1. Requisitos Previos

1. **Código en GitHub**: Asegúrate de que tu proyecto `rutina_personal` esté subido a un repositorio de GitHub.
2. **Cuenta en Render**: Crea una cuenta en [render.com](https://render.com/) si no tienes una (puedes iniciar sesión con GitHub).

## 2. Preparación del Código (Ya realizado)

He verificado tu código y ya está listo para Render:

* ✅ **Puerto Dinámico**: Tu `server.js` usa `process.env.PORT`, lo cual es necesario para que Render asigne el puerto automáticamente.
* ✅ **Scripts de Inicio**: Tu `package.json` tiene el script `"start": "node server.js"`.
* ✅ **Dependencias**: Las dependencias necesarias están en `package.json`.

## 3. Crear el Servicio en Render

Sigue estos pasos en el panel de control de Render:

1. Haz clic en el botón **"New +"** (arriba a la derecha) y selecciona **"Web Service"**.
2. Selecciona **"Build and deploy from a Git repository"** y haz clic en "Next".
3. Busca y conecta tu repositorio de GitHub `rutina_personal`. Si no aparece, asegúrate de dar permisos a Render para acceder a tus repositorios.

## 4. Configuración del Servicio

Rellena el formulario con los siguientes datos exactos:

| Campo | Valor | Nota |
| :--- | :--- | :--- |
| **Name** | `rutina-personal-api` (o el que gustes) | Identificador único en tu dashboard. |
| **Region** | `Frankfurt` (o la más cercana a ti) | Para menor latencia. |
| **Branch** | `main` o `master` | La rama donde está tu código actualizado. |
| **Root Directory** | `backend` | **MUY IMPORTANTE**: Como tu backend está en una subcarpeta, debes especificar esto. |
| **Runtime** | `Node` | |
| **Build Command** | `npm install` | Render ejecutará esto para instalar tus librerías. |
| **Start Command** | `npm start` | Render ejecutará esto para iniciar el servidor. |
| **Plan Type** | `Free` | Selecciona el plan gratuito. |

## 5. Variables de Entorno

Si tu archivo `.env` local tiene variables importantes (además de PORT, que Render pone automático), debes agregarlas:

1. Baja hasta la sección **"Environment Variables"** en la misma página de configuración.
2. Haz clic en **"Add Environment Variable"**.
3. Agrega cualquier clave/valor que necesites (ej. keys de base de datos si usas una externa).
    * *Nota: No necesitas agregar `PORT`, Render lo hace solo.*

## 6. Despliegue y Verificación

1. Haz clic en el botón **"Create Web Service"** al final de la página.
2. Render comenzará a construir tu aplicación. Verás los logs en tiempo real.
    * Buscará la carpeta `backend`.
    * Ejecutará `npm install`.
    * Ejecutará `npm start`.
3. Cuando termine, verás un mensaje de **"Live"** acompañado de una URL (ej. `https://rutina-personal-api.onrender.com`).

### Probar que funciona

Abre tu navegador y ve a la URL que te dio Render agregando `/health` al final:
`https://<tu-url-de-render>.onrender.com/health`

Deberías ver:

```json
{ "status": "OK", "text": "Personal Life Tracker API" }
```

## 7. Actualizar el Frontend (Paso siguiente)

Una vez tengas la URL de tu backend funcionando (el link que termina en `.onrender.com`), necesitarás actualizar tu Frontend para que apunte a esa dirección en lugar de `http://localhost:3000`.

Busca donde haces las llamadas a la API en tu frontend (ej. `fetch` o `axios`) y actualiza la URL base.

---
¡Listo! Tu backend ya está en la nube.
