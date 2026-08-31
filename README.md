# Servicio web de E-commerce B2C

Plataforma de E-commerce compuesta por tres servicios independientes desplegados cada uno en **Vercel**, con persistencia distribuida entre **MongoDB Atlas** y **MySQL (Aiven)**.

## Arquitectura

```
                    ┌──────────────────┐
        ┌──────────►│    Auth API      │───────► MongoDB Atlas
        │ (login,   │  (Node/Express)  │         (usuarios)
        │  registro,└──────────────────┘
        │  Google)
┌───────┴─────────┐                         ┌───────────────────┐
│   Frontend      │                         │    Backend        │
│   (Next.js)     │────────────────────────►│  (Node/Express)   │
│                 │  (productos, carrito,   │                   │
└─────────────────┘   órdenes, pagos,       └────────┬──────────┘
                      promociones, panel admin)      │
                                                     ├──► MongoDB Atlas
                                                     │    (productos)
                                                     │
                                                     └──► MySQL (Aiven)
                                                          (órdenes, categorías,
                                                          promociones)
         
```

- **Frontend**: Next.js (App Router), consume ambas APIs vía Axios.
- **Auth API**: registro/login, OAuth con Google, emisión de JWT.
- **Backend (Ecommerce API)**: catálogo, carrito/checkout, órdenes, pagos, promociones, panel admin.
- El **JWT emitido por Auth API** es validado por el Backend, permitiendo desacoplar autenticación de la lógica de negocio.

## Tecnologías

### Frontend
- **Next.js 15** (App Router, RSC) + **React 19**
- **Tailwind CSS 4** + componentes basados en **shadcn/ui** (Radix UI primitives)
- **Zustand** para estado global (carrito, auth) con persistencia en `sessionStorage`
- **Axios** con interceptores para adjuntar JWT automáticamente

### Auth API
- **Node.js + Express**
- **MongoDB (MongoDB Atlas)** (Mongoose) para el modelo de usuarios
- **JWT** para autenticación stateless
- **Passport.js** con estrategia **Google OAuth2**
- **bcryptjs** para hasheo de contraseñas
- Rate limiting específico en endpoints de auth

### Backend (Ecommerce API)
- **Node.js + Express**
- **MongoDB (MongoDB Atlas)** (Mongoose) → catálogo de productos, variantes, reviews
- **MySQL (Aiven)** → órdenes, categorías, promociones
- **MercadoPago SDK** para procesamiento de pagos
- **Cloudinary** para almacenamiento y transformación de imágenes de productos
- **Helmet** (CSP, HSTS) + **xss** para sanitización de inputs
- Motor de precios propio para aplicar promociones (globales/específicas) con reglas de prioridad
- Cifrado **AES-256-GCM** de datos sensibles (contacto y domicilio) antes del guardado

## Comunicación entre servicios

➔ El **Frontend** autentica usuarios contra la **Auth API** (`/api/auth/*`), obteniendo un JWT.  
➔ El JWT se guarda en `sessionStorage` y se adjunta en cada request hacia Auth API y Backend.  
➔ El **Backend** valida el JWT de forma local sin necesidad de llamar a Auth API en cada request.  
➔ El **Backend** centraliza el acceso a **MongoDB** (catálogo) y **MySQL** (transaccional: órdenes, promociones, categorías).  
➔ Los pagos se procesan mediante **MercadoPago**: el Frontend crea la orden en el Backend, luego solicita una preferencia de pago; MercadoPago notifica el resultado vía **webhook** hacia el Backend, que actualiza el estado de la orden y descuenta stock si se confirma la compra.  
➔ Para imágenes de productos, el Frontend pide una firma temporal al Backend, generada con credenciales de **Cloudinary**. Con esa firma, el Frontend sube la imagen directamente a Cloudinary y guarda la URL resultante en MongoDB. Así se aligera el Backend en el tráfico de archivos.

## Funcionalidades y características

### Usuario / Cliente
- Registro e inicio de sesión (email/contraseña o Google OAuth)
- Navegación y búsqueda predictiva de catálogo (filtros por categoría, marca, precio)
- Selección de variantes de producto (Color, Almacenamiento, RAM)
- Carrito de compras persistente durante la sesión (zustand + sessionStorage)
- Checkout en 3 pasos (datos de contacto → envío → pago)
- Pago seguro vía MercadoPago
- Visualización de sus órdenes y estado de las mismas

### Administrador
- **Gestión de productos**: alta, edición, baja, variantes, imágenes con mapeo imagen↔variante
- **Gestión de categorías**: CRUD completo
- **Gestión de promociones**: creación de descuentos globales o por producto, con condiciones (monto mínimo, exclusiones de marca/categoría), programación de vigencia, prioridades y tiempo
- **Gestión de órdenes**: visualización completa, cambio de estado, eliminación
- Acceso protegido mediante rol validado tanto en frontend (guards) como en backend (middleware)
