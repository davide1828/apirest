# Documentación de Módulos Adicionales - API REST Multimedia

Esta documentación describe los cuatro nuevos módulos creados para el sistema de gestión de películas y series.

## Tabla de Contenidos
1. [Módulo Director](#módulo-director)
2. [Módulo Productora](#módulo-productora)
3. [Módulo Tipo](#módulo-tipo)
4. [Módulo Media](#módulo-media)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Instrucciones de Uso](#instrucciones-de-uso)

---

## Módulo Director

### Descripción
Permite registrar y editar directores principales de las producciones (películas y series).

### Campos
- **nombre** (string, requerido): Nombre único del director
- **estado** (string): `'Activo'` o `'Inactivo'` (default: `'Activo'`)
- **fechaCreacion** (date): Fecha de creación automática
- **fechaActualizacion** (date): Fecha de última actualización

### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/director` | Obtiene todos los directores |
| POST | `/api/director` | Crea un nuevo director |
| GET | `/api/director/:id` | Obtiene un director por ID |
| PUT | `/api/director/:id` | Actualiza un director |
| DELETE | `/api/director/:id` | Elimina un director |

### Ejemplo de Creación
```json
POST /api/director
{
  "nombre": "Steven Spielberg"
}
```

**Respuesta (201)**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "nombre": "Steven Spielberg",
  "estado": "Activo",
  "fechaCreacion": "2024-01-15T10:30:00.000Z",
  "fechaActualizacion": "2024-01-15T10:30:00.000Z"
}
```

---

## Módulo Productora

### Descripción
Permite registrar y editar las productoras principales de las producciones (Disney, Warner, Paramount, MGM, etc.).

### Campos
- **nombre** (string, requerido): Nombre único de la productora
- **estado** (string): `'Activo'` o `'Inactivo'` (default: `'Activo'`)
- **slogan** (string, opcional): Slogan de la productora
- **descripcion** (string, opcional): Descripción de la productora
- **fechaCreacion** (date): Fecha de creación automática
- **fechaActualizacion** (date): Fecha de última actualización

### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productora` | Obtiene todas las productoras |
| POST | `/api/productora` | Crea una nueva productora |
| GET | `/api/productora/:id` | Obtiene una productora por ID |
| PUT | `/api/productora/:id` | Actualiza una productora |
| DELETE | `/api/productora/:id` | Elimina una productora |

### Ejemplo de Creación
```json
POST /api/productora
{
  "nombre": "Universal Pictures",
  "slogan": "Creating Magic",
  "descripcion": "Empresa productora de películas de Hollywood"
}
```

**Respuesta (201)**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "nombre": "Universal Pictures",
  "estado": "Activo",
  "slogan": "Creating Magic",
  "descripcion": "Empresa productora de películas de Hollywood",
  "fechaCreacion": "2024-01-15T10:30:00.000Z",
  "fechaActualizacion": "2024-01-15T10:30:00.000Z"
}
```

---

## Módulo Tipo

### Descripción
Permite registrar los tipos de multimedia (serie, película, documental, etc.). Por ahora se contemplan serie y película, pero se pueden gestionar otros deseados a futuro.

### Campos
- **nombre** (string, requerido): Nombre único del tipo
- **descripcion** (string, opcional): Descripción del tipo
- **fechaCreacion** (date): Fecha de creación automática
- **fechaActualizacion** (date): Fecha de última actualización

### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tipo` | Obtiene todos los tipos |
| POST | `/api/tipo` | Crea un nuevo tipo |
| GET | `/api/tipo/:id` | Obtiene un tipo por ID |
| PUT | `/api/tipo/:id` | Actualiza un tipo |
| DELETE | `/api/tipo/:id` | Elimina un tipo |

### Ejemplo de Creación
```json
POST /api/tipo
{
  "nombre": "Película",
  "descripcion": "Contenido multimedia de formato película"
}
```

**Respuesta (201)**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "nombre": "Película",
  "descripcion": "Contenido multimedia de formato película",
  "fechaCreacion": "2024-01-15T10:30:00.000Z",
  "fechaActualizacion": "2024-01-15T10:30:00.000Z"
}
```

---

## Módulo Media

### Descripción
Gestiona películas y series. Permite agregar, editar, eliminar y consultar producciones multimedia. 

### Campos
- **serial** (string, requerido, único): Serial único de la media
- **titulo** (string, requerido): Título de la película o serie
- **sinopsis** (string, opcional): Sinopsis o descripción
- **urlPelicula** (string, requerido, único): URL única de la película o serie
- **imagen** (string, opcional): URL de la imagen o foto de portada
- **anioEstreno** (number, requerido): Año de estreno
- **genero** (ObjectId, requerido): Referencia a un Género activo
- **director** (ObjectId, requerido): Referencia a un Director activo
- **productora** (ObjectId, requerido): Referencia a una Productora activa
- **tipo** (ObjectId, requerido): Referencia a un Tipo
- **fechaCreacion** (date): Fecha de creación automática
- **fechaActualizacion** (date): Fecha de última actualización

### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/media` | Obtiene todas las películas y series |
| POST | `/api/media` | Crea una nueva película o serie |
| GET | `/api/media/:id` | Obtiene una película o serie por ID |
| PUT | `/api/media/:id` | Actualiza una película o serie |
| DELETE | `/api/media/:id` | Elimina una película o serie |

### Ejemplo de Creación
```json
POST /api/media
{
  "serial": "UNIVERS-001",
  "titulo": "Jaws",
  "sinopsis": "Un tiburón depredador ataca a una popular playa",
  "urlPelicula": "https://www.peliculas.com/jaws",
  "imagen": "https://www.imagenes.com/jaws.jpg",
  "anioEstreno": 1975,
  "genero": "507f1f77bcf86cd799439011",
  "director": "507f1f77bcf86cd799439015",
  "productora": "507f1f77bcf86cd799439016",
  "tipo": "507f1f77bcf86cd799439017"
}
```

**Respuesta (201)** (con referencias pobladas)
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "serial": "UNIVERS-001",
  "titulo": "Jaws",
  "sinopsis": "Un tiburón depredador ataca a una popular playa",
  "urlPelicula": "https://www.peliculas.com/jaws",
  "imagen": "https://www.imagenes.com/jaws.jpg",
  "anioEstreno": 1975,
  "genero": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Acción"
  },
  "director": {
    "_id": "507f1f77bcf86cd799439015",
    "nombre": "Steven Spielberg"
  },
  "productora": {
    "_id": "507f1f77bcf86cd799439016",
    "nombre": "Universal Pictures"
  },
  "tipo": {
    "_id": "507f1f77bcf86cd799439017",
    "nombre": "Película"
  },
  "fechaCreacion": "2024-01-15T10:30:00.000Z",
  "fechaActualizacion": "2024-01-15T10:30:00.000Z"
}
```

### Validaciones Importantes
- **serial**: Debe ser único en la base de datos
- **urlPelicula**: Debe ser única en la base de datos
- **genero**: Solo se pueden seleccionar géneros con estado "Activo"
- **director**: Solo se pueden seleccionar directores con estado "Activo"
- **productora**: Solo se pueden seleccionar productoras con estado "Activo"
- **tipo**: Se pueden seleccionar todos los tipos registrados

---

## Estructura del Proyecto

Después de crear los módulos, la estructura del proyecto es:

```
Apirest/
├── backend/
│   ├── controllers/
│   │   ├── generoController.js
│   │   ├── directorController.js
│   │   ├── productoraController.js
│   │   ├── tipoController.js
│   │   └── mediaController.js
│   ├── models/
│   │   ├── Genero.js
│   │   ├── Director.js
│   │   ├── Productora.js
│   │   ├── Tipo.js
│   │   └── Media.js
│   ├── routes/
│   │   ├── genero.js
│   │   ├── director.js
│   │   ├── productora.js
│   │   ├── tipo.js
│   │   └── media.js
│   ├── db/
│   │   └── db-connection-mongo.js
│   ├── index.js
│   └── package.json
├── Ejemplos_Peticiones_API.json
├── Ejemplos_Peticiones_Modulos_Adicionales.json
├── Modulos_Adicionales_README.md
└── README.md
```

---

## Instrucciones de Uso

### 1. Instalación de Dependencias
```bash
cd backend
npm install
```

### 2. Iniciar el Servidor
```bash
npm start
```

El servidor estará ejecutándose en `http://localhost:4000`

### 3. Orden de Creación Recomendado

Para crear una media (película o serie), primero debe crear:

1. **Género** - Usando el módulo existente de Género
   ```bash
   POST /api/genero
   ```

2. **Director** - Nuevo módulo
   ```bash
   POST /api/director
   ```

3. **Productora** - Nuevo módulo
   ```bash
   POST /api/productora
   ```

4. **Tipo** - Nuevo módulo
   ```bash
   POST /api/tipo
   ```

5. **Media** - Nuevo módulo (dependencia de los anteriores)
   ```bash
   POST /api/media
   ```

### 4. Ejemplo Completo de Flujo de Creación

#### Paso 1: Crear Género
```bash
curl -X POST http://localhost:4000/api/genero \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Acción", "descripcion": "Películas de acción y aventura"}'
```
**Guardar el `_id` deL género en la respuesta**

#### Paso 2: Crear Director
```bash
curl -X POST http://localhost:4000/api/director \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Steven Spielberg"}'
```
**Guardar el `_id` del director en la respuesta**

#### Paso 3: Crear Productora
```bash
curl -X POST http://localhost:4000/api/productora \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Universal Pictures", "slogan": "Creating Magic"}'
```
**Guardar el `_id` de la productora en la respuesta**

#### Paso 4: Crear Tipo
```bash
curl -X POST http://localhost:4000/api/tipo \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Película", "descripcion": "Contenido de formato película"}'
```
**Guardar el `_id` del tipo en la respuesta**

#### Paso 5: Crear Media
```bash
curl -X POST http://localhost:4000/api/media \
  -H "Content-Type: application/json" \
  -d '{
    "serial": "UNIVERS-001",
    "titulo": "Jaws",
    "sinopsis": "Un tiburón depredador ataca a una popular playa",
    "urlPelicula": "https://www.peliculas.com/jaws",
    "imagen": "https://www.imagenes.com/jaws.jpg",
    "anioEstreno": 1975,
    "genero": "ID_DEL_GENERO",
    "director": "ID_DEL_DIRECTOR",
    "productora": "ID_DE_LA_PRODUCTORA",
    "tipo": "ID_DEL_TIPO"
  }'
```

### 5. Códigos de Error Comunes

| Código | Significado | Causa |
|--------|-------------|-------|
| 200 | OK | Operación exitosa (GET, PUT) |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o recurso duplicado |
| 404 | Not Found | El recurso con el ID no existe |
| 500 | Internal Server Error | Error del servidor |

---

## Notas Importantes

1. **Integridad Referencial**: El módulo Media valida que los IDs de género, director, productora y tipo existan antes de crear la media.

2. **Estado Activo/Inactivo**: Los módulos Director y Productora tienen un campo `estado` que permite marcar registros como "Activo" o "Inactivo". Se recomienda validar este estado antes de crear medias.

3. **Unicidad**: Los campos `nombre` en Director, `nombre` en Productora, `nombre` en Tipo, `serial` en Media y `urlPelicula` en Media son únicos en la base de datos.

4. **Poblamiento de Referencias**: Cuando se obtiene una media (GET), el controlador automáticamente "puebla" (populate) las referencias de género, director, productora y tipo, devolviendo no solo el ID sino también el nombre.

5. **Actualización de Fechas**: La fecha de actualización (`fechaActualizacion`) se actualiza automáticamente cada vez que se modifica un registro.

---

## Archivo de Documentación de Peticiones

Para mayor detalle sobre las peticiones HTTP y ejemplos en diferentes formatos, consulta:
- `Ejemplos_Peticiones_API.json` - Ejemplos del módulo Género
- `Ejemplos_Peticiones_Modulos_Adicionales.json` - Ejemplos de los nuevos módulos

---

**Versión**: 1.0  
**Última actualización**: 8 de marzo de 2026
