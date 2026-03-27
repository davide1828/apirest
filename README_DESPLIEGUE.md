# Proyecto de Gestión de Medios (Películas y Series)

Este repositorio contiene la arquitectura completa de la aplicación, organizada en un monorepo con dos componentes principales.

## Estructura del Proyecto

- **/backend**: API REST construida con Node.js, Express y MongoDB (Mongoose). Implementa validaciones, middlewares de seguridad, manejo global de errores y generación de seriales automáticos.
- **/frontend**: Aplicación SPA construida con React, Vite y Bootstrap. Consume la API del backend mediante Axios.

## Despliegue Cloud (Producción)

Para el despliegue se han configurado las siguientes plataformas:
1. **Backend:** Desplegado en **Render**.
2. **Frontend:** Desplegado en **Netlify**.

### Configuración requerida
Cada carpeta contiene un archivo `.env.template` con las variables de entorno necesarias para que el sistema funcione correctamente en la nube.

---

**Autor:** Cristian David España Figueroa  
**Curso:** Ingeniería Web
