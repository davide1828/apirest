PORTía de Despliegue Cloud: Backend y Frontend

Este documento detalla el proceso paso a paso para desplegar la arquitectura de la aplicación en plataformas de nube gratuitas y escalables.

---

## 1. Portada e Introducción
**Asignatura:** Ingeniería Web  
**Proyecto:** API REST y Frontend de Gestión Multimedia  
**Plataformas:** Render (Backend) & Netlify (Frontend)  
**Base de Datos:** MongoDB Atlas

**Introducción:**  
El despliegue en la nube es la fase final del ciclo de vida de desarrollo de software, donde la aplicación pasa de un entorno local controlado a servidores públicos accesibles vía Internet. En este proceso, utilizaremos el modelo **PaaS (Platform as a Service)** para delegar la gestión del servidor a Render y Netlify.

---

## 2. Paso a Paso: Despliegue del Backend (Render)

### Requisitos Previos:
- Repositorio de la carpeta `backend` cargado en GitHub.
- Cadena de conexión de MongoDB Atlas lista.

### Proceso en Render:
1. **Crear Web Service:** Selecciona "New" -> "Web Service".
2. **Conectar GitHub:** Selecciona el repositorio de tu proyecto.
3. **Configurar Build & Start (Mono-Repo):**
   - **Root Directory:** Pon `backend` (o el nombre de tu carpeta de backend).
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. **Environment Variables (Crítico):**
   - Agrega `MONGO_URI` con el valor de tu `.env`.
   - Agrega `PORT` con el valor `10000`.
   - Agrega `FRONTEND_URL` con la URL de Netlify.
   - Agrega `JWT_SECRET` con una clave segura.

> [!TIP]
> **Ruta Raíz**: Hemos configurado una ruta GET en `/` que devuelve "API corriendo correctamente" para facilitar la verificación del despliegue.

> [!TIP]
> **Captura Recomendada:** Toma un screenshot de la sección "Environment Variables" en Render una vez configuradas.

---

## 3. Paso a Paso: Despliegue del Frontend (Netlify)

### Requisitos Previos:
- Repositorio de la carpeta `frontend` cargado en GitHub.

### Proceso en Netlify:
1. **Add new site:** "Import from git".
2. **Settings (Mono-Repo):**
   - **Base directory:** Pon `frontend` (o el nombre de tu carpeta de frontend).
   - **Build Command:** `npm run build`
   - **Publish directory:** `frontend/dist` (Importante: Netlify a veces requiere el path relativo desde el root).
3. **Variables de Entorno:**
   - Ve a "Site configuration" -> "Environment variables".
   - Agrega `VITE_API_URL` apuntando a la URL que te entregó Render (ej. `https://api-peliculas.onrender.com/api`).
4. **Manejo de Rutas (Redirects):**
   - Para que React Router funcione al recargar, crea un archivo llamado `_redirects` en la carpeta `public` del frontend con el contenido: `/* /index.html 200`.

> [!TIP]
> **Captura Recomendada:** Toma un screenshot del panel de Netlify mostrando el "Site URL" funcionando.

---

## 4. Conclusión
El despliegue exitoso garantiza que la separación de responsabilidades (Backend en una URL y Frontend en otra) se mantenga intacta. Esto permite escalar cada parte de forma independiente y asegura que la base de datos centralizada (Atlas) sea el puente de información común para todos los usuarios.

---

## 5. Glosario de URLs (Finalizadas)
- **Backend URL:** [https://apirest-67y5.onrender.com](https://apirest-67y5.onrender.com)
- **Frontend URL:** [https://apiresspeliculas.netlify.app/](https://apiresspeliculas.netlify.app/)

---
**Desarrollado con ❤️ para el curso de Ingeniería Web**
