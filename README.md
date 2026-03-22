# 🎬 API REST de Alquiler de Películas y Series

Este proyecto es una aplicación completa para la gestión de un catálogo de películas y series, con un **backend** desarrollado en **Node.js** y **Express**, y un **frontend** en **React** con **Vite**. Utiliza **MongoDB Atlas** como base de datos en la nube.

## 📋 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose** - ODM para MongoDB
- **CORS** - Para manejo de solicitudes cross-origin
- **Dotenv** - Gestión de variables de entorno

### Frontend
- **React 19** - Biblioteca para interfaces de usuario
- **Vite** - Herramienta de desarrollo rápida
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Framework CSS

## 🔧 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Cuenta en **MongoDB Atlas** con un cluster configurado
- Navegador web moderno

## 🚀 Instalación

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/davide1828/apirest.git
   cd apirest
   ```

2. **Instala las dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Instala las dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

## ⚙️ Configuración

### Backend (.env)
Crea un archivo `.env` en la carpeta `backend` con la siguiente configuración:

```env
PORT=4000
MONGO_URI=mongodb://tu_usuario:tu_contraseña@cluster.mongodb.net/db_Proyectogr05?ssl=true&replicaSet=atlas-xxx-shard-0&authSource=admin&appName=Cluster0
```

**Nota:** Reemplaza `tu_usuario`, `tu_contraseña` y los detalles del cluster con tus credenciales reales de MongoDB Atlas.

### Frontend (.env)
El frontend ya tiene configurado el archivo `.env` apuntando al backend local:

```env
VITE_API_URL=http://localhost:4000/api
```

## ▶️ Ejecución del Proyecto

### Opción 1: Ejecutar Backend y Frontend por separado

1. **Inicia el backend:**
   ```bash
   cd backend
   npm start
   ```
   El servidor se ejecutará en `http://localhost:4000`

2. **Inicia el frontend (en una nueva terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   La aplicación React se ejecutará en `http://localhost:5173` (o el puerto que Vite asigne)

### Opción 2: Usar scripts personalizados (si los configuras)

Puedes crear scripts en el `package.json` raíz para ejecutar ambos simultáneamente usando herramientas como `concurrently`.

## 📖 Uso

Una vez que ambos servidores estén ejecutándose:

1. Abre tu navegador en `http://localhost:5173`
2. Navega por las diferentes secciones:
   - **Géneros**: Gestiona los géneros de películas/series
   - **Directores**: Administra los directores
   - **Productoras**: Maneja las compañías productoras
   - **Tipos**: Clasifica el tipo de contenido (Película, Serie, etc.)
   - **Media**: Catálogo principal con todas las películas/series

## 🔗 Endpoints de la API

### Géneros
- `GET /api/genero` - Obtener todos los géneros
- `POST /api/genero` - Crear un nuevo género
- `PUT /api/genero/:id` - Actualizar un género
- `DELETE /api/genero/:id` - Eliminar un género

### Directores
- `GET /api/director` - Obtener todos los directores
- `POST /api/director` - Crear un nuevo director
- `PUT /api/director/:id` - Actualizar un director
- `DELETE /api/director/:id` - Eliminar un director

### Productoras
- `GET /api/productora` - Obtener todas las productoras
- `POST /api/productora` - Crear una nueva productora
- `PUT /api/productora/:id` - Actualizar una productora
- `DELETE /api/productora/:id` - Eliminar una productora

### Tipos
- `GET /api/tipo` - Obtener todos los tipos
- `POST /api/tipo` - Crear un nuevo tipo
- `PUT /api/tipo/:id` - Actualizar un tipo
- `DELETE /api/tipo/:id` - Eliminar un tipo

### Media
- `GET /api/media` - Obtener todo el contenido multimedia
- `POST /api/media` - Crear nueva entrada de media
- `PUT /api/media/:id` - Actualizar entrada de media
- `DELETE /api/media/:id` - Eliminar entrada de media

## 🗂️ Estructura del Proyecto

```
apirest/
├── backend/
│   ├── controllers/     # Lógica de negocio
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definición de rutas
│   ├── db/            # Configuración de base de datos
│   ├── index.js       # Punto de entrada del servidor
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── utils/      # Utilidades (API client)
│   │   └── App.jsx     # Componente principal
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request



---

**¡Disfruta gestionando tu catálogo de películas y series!** 🍿🎥
---
### 💻 Cómo ejecutar el proyecto:
Para iniciar el servidor en modo desarrollo (con **Nodemon**):
```bash
npm run dev
