# 🐱 TiendaCats — EV3 & Examen Final

**TiendaCats** es una plataforma web **fullstack** para la venta y gestión de productos para gatos, desarrollada como proyecto evaluativo para la **Evaluación Parcial 3 (EV3)** y el **Examen Final** de la asignatura **DSY1104**.

El proyecto integra frontend y backend, incorporando seguridad, roles de usuario, gestión de productos y órdenes, y documentación de APIs.

---

## 🎯 Alcance del proyecto

Este proyecto corresponde a la **Entrega 3 (EV3)** y **Examen Final**, e integra mejoras progresivas de las entregas anteriores:

- **EV1**: Prototipo inicial y estructura base del proyecto  
- **EV2**: Frontend funcional con carrito, autenticación local y navegación  
- **EV3 / Examen**:  
  - Integración Frontend + Backend  
  - Seguridad con Firebase JWT  
  - Roles (USER / ADMIN)  
  - Gestión de productos, usuarios y órdenes  
  - Documentación de APIs y demo funcional  

---

## 🧱 Arquitectura del sistema

El proyecto se divide en dos módulos principales:

tienda-cats/
├── backend/
│ └── tienda-cats-backend
│ ├── Spring Boot
│ ├── Firebase Admin SDK
│ ├── Seguridad JWT
│ └── API REST
│
└── frontend/
└── tienda-cats-react
├── React + Vite
├── React Router
├── React-Bootstrap
└── Consumo de API REST

---

## ⚙️ Tecnologías utilizadas

### 🔧 Backend
- Java 17  
- Spring Boot  
- Spring Security  
- Firebase Admin SDK (JWT)  
- H2 Database  
- Swagger / OpenAPI  

### 🎨 Frontend
- React + Vite  
- React Router DOM  
- React-Bootstrap  
- Fetch API  
- LocalStorage  

---

## 🔐 Seguridad y control de acceso

La aplicación utiliza **Firebase Authentication** y **JWT** para proteger los endpoints del backend.

### Roles implementados:

**USER**
- Ver catálogo de productos
- Agregar productos al carrito
- Crear órdenes de compra
- Ver sus propias compras

**ADMIN**
- CRUD completo de productos
- Visualización de todas las órdenes
- Gestión y visualización de usuarios
- Acceso a reportes

Las rutas están protegidas mediante **Spring Security** y validación de roles.

---
## 🔑 Acceso a Panel de Administración (ADMIN)

El acceso al **panel de administración** está protegido mediante **Firebase Authentication + JWT** y validación de **roles** en el backend.

### 👤 Usuario Administrador

Para acceder al panel de administración se requiere:

- Estar autenticado con **Firebase**
- Contar con el **rol ADMIN** asignado como *custom claim* en Firebase
- Enviar el **token JWT válido** en cada request al backend

### 📧 Credencial de administrador (ejemplo)

> ⚠️ El correo administrador se define en Firebase mediante custom claims.

Ejemplo de usuario administrador utilizado para pruebas:

Email: admin@tiendacats.com

Rol: ADMIN

### 🔐 Flujo de autenticación

1. El administrador inicia sesión desde el frontend.
2. Firebase genera un **JWT (ID Token)**.
3. El frontend guarda el token en `localStorage`.
4. Cada request protegida envía el token en el header:

Authorization: Bearer <firebase_token>


5. El backend valida el token con **Firebase Admin SDK**.
6. Spring Security autoriza o rechaza el acceso según el rol.

### 🖥️ Acceso al panel ADMIN

Una vez autenticado como administrador, se puede acceder a:

/admin


Desde el panel es posible:

- Crear, editar y eliminar productos
- Ver todas las órdenes del sistema
- Visualizar usuarios registrados en Firebase

Si el usuario **no tiene rol ADMIN**, el acceso es rechazado automáticamente.

## 🛍️ Funcionalidades principales

- Catálogo de productos
- Carrito de compras con persistencia
- Creación y visualización de órdenes
- Panel de administración
- Gestión de productos (crear, editar, eliminar)
- Seguridad con JWT
- Documentación de APIs con Swagger
- Interfaz responsive

---

## ▶️ Ejecución del proyecto

### 🔧 Backend

1. Abrir la carpeta:

backend/tienda-cats-backend

2. Ejecutar:


./mvnw spring-boot:run

3. Acceder a Swagger:


http://localhost:8080/swagger-ui.html


---

### 🎨 Frontend

1. Abrir la carpeta:


frontend/tienda-cats-react

2. Instalar dependencias:


npm install

3. Ejecutar:


npm run dev

4. Abrir en el navegador:


http://localhost:5173


---

## 🔁 Evolución del proyecto (EV2 → EV3)

En la **EV2**, el proyecto consistía en un frontend en React con:

- Autenticación local mediante LocalStorage
- Carrito de compras persistente
- Catálogo cargado desde archivos JSON

Para la **EV3 y Examen**, el sistema fue evolucionado a una solución **fullstack**, incorporando:

- Backend en Spring Boot
- Seguridad con Firebase JWT
- Persistencia de datos
- Roles y control de acceso
- Integración completa Frontend + Backend

---

## 📘 Documentación incluida

- 📄 Documentación de APIs (Swagger)
- 📘 Manual de usuario (EV3)
- 📽️ Video demo funcional (link entregado en la evaluación)
- 💻 Código fuente en GitHub

---

## 👩‍💻 Autora

Proyecto desarrollado por **Milagros**  
Asignatura **DSY1104**  
Entrega **EV3 y Examen Final**

