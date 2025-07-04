# VetCare Backend

Este es el backend del sistema **VetCare**, una aplicación completa de gestión veterinaria. La API está construida con **Node.js**, **Express** y utiliza **MongoDB** como base de datos. Permite gestionar usuarios, mascotas, servicios veterinarios y citas médicas, integrando autenticación segura y control de accesos.

---

## 📦 Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Cookies para autenticación
- Middleware de seguridad: Helmet, CORS, Rate Limiting
- Protección contra ataques comunes

---

## 🚀 Funcionalidades principales

- **Autenticación y Autorización**
  - Login y registro de usuarios con cookies
  - Control de roles (administrador, usuario, etc.)

- **Gestión de usuarios**
  - Registro, login, obtener sesión
  - Rutas protegidas

- **Servicios veterinarios**
  - Crear, editar, eliminar y listar servicios
  - Carga de imágenes de servicios

- **Mascotas**
  - CRUD completo de mascotas por usuario

- **Citas médicas**
  - Solicitud, edición y gestión de citas por usuario y administrador

---

## 🔐 Seguridad

- Helmet: protección de cabeceras HTTP
- Rate Limiting: límite de peticiones por IP
- CORS configurado con listas blancas
- Cookies HttpOnly y credenciales seguras
- Middleware personalizado para manejo de errores

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=4000
MONGO_URI=tu_string_de_conexion_mongo
JWT_SECRET=una_clave_secreta_segura
