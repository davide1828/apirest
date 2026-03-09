# 🎬 Proyecto - API REST de Películas y Series
Este es un proyecto de backend desarrollado con **Node.js** y **Express** para la gestión de contenidos multimedia, utilizando **MongoDB Atlas** como base de datos en la nube.
---
### 🚀 Instalación y Configuración:
1.  **Clonar este repositorio:**
    ```bash
    git clone https://github.com/usuario/NombreProyecto.git
    ```
2.  **Instalar dependencias:**
    Accede a la carpeta `backend` y ejecuta:
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea un archivo llamado `.env` en la carpeta `backend` y añade tu URI de conexión a MongoDB:
    ```text
    PORT=4000
    MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/NombreProyecto?retryWrites=true&w=majority
    ```
---
### 💻 Cómo ejecutar el proyecto:
Para iniciar el servidor en modo desarrollo (con **Nodemon**):
```bash
npm run dev