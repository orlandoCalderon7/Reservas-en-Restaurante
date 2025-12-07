# Sistema de Reservas “Los Tres Sabores”

Este proyecto es una aplicación web desarrollada en React que implementa un sistema de reservas para un restaurante.  
Fue elaborado con el objetivo de simular un flujo completo de gestión, tanto para clientes como para personal administrativo, utilizando únicamente front-end y almacenamiento local.

## 1. Descripción General
El sistema cuenta con dos tipos de acceso:

### ● Cliente
- Registro e inicio de sesión.
- Visualización de las cartas del restaurante (PDF).
- Realización de reservas indicando fecha, hora y cantidad de personas.
- Recibo de confirmación con número de reserva generado automáticamente.

### ● Administrador
- Acceso a un panel con métricas del sistema.
- Visualización detallada de reservas.
- Gestión de reservas pendientes y confirmadas.
- Navegación interna exclusiva del administrador.

Toda la lógica de navegación está centralizada en **App.js**, utilizando estados para controlar la vista activa.

## 2. Características Principales
- Interfaz moderna y adaptable (CSS personalizado).
- Flujo de autenticación básica usando LocalStorage.
- Generación de códigos únicos de reserva.
- Gestión de múltiples vistas desde un solo componente central.
- Panel administrativo funcional con estadísticas.
- Cartas del restaurante integradas en formato PDF.
- Código organizado por componentes independientes.

## 3. Estructura del Proyecto

```
sistema-pedidos/
│
├── public/
│   ├── cartas/
│   │   ├── carta-bebidas.pdf
│   │   ├── carta-comidas.pdf
│   │   └── carta-promos.pdf
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   └── logo/
│   │
│   ├── components/
│   │   ├── CompNav.js / .css
│   │   ├── CompLogin.js / .css
│   │   ├── CompRegistro.js / .css
│   │   ├── CompRecuperarPass.js / .css
│   │   ├── CompActualizarPass.js / .css
│   │   ├── CompCarta.js / .css
│   │   ├── CompFormReserva.js / .css
│   │   ├── CompConfirmacion.js / .css
│   │   ├── CompPanelAdmin.js / .css
│   │   ├── CompGestionarReservas.js / .css
│   │   └── CompFooter.js / .css
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── App.test.js
│
├── package.json
├── package-lock.json
└── README.md
```

## 4. Tecnologías Utilizadas

```
"react": "^19.2.0",
"react-dom": "^19.2.0",
"react-scripts": "5.0.1",
"@testing-library/react": "^16.3.0",
"@testing-library/jest-dom": "^6.9.1",
"@testing-library/user-event": "^13.5.0",
"web-vitals": "^2.1.4"
```

## 5. Instalación y Ejecución

1. Clonar el repositorio:
```
git clone <url-del-repo>
```

2. Instalar dependencias:
```
npm install
```

3. Iniciar el servidor:
```
npm start
```

## 6. Componentes Principales
Descripción de los componentes principales según su función en el sistema (Nav, Login, Registro, Cartas, Form Reservas, Gestión Reservas, Confirmación, Panel Admin, Recuperar Pass, Footer, Actualizar).

## 7. Flujo de Navegación
Controlado con el estado **vista** en App.js:
- Inicio → Login → Cartas → Formulario → Confirmación
- Admin → Panel → Gestión

## 8. Gestión de Datos
Toda la información se almacena mediante **localStorage**:
- Usuarios
- Reservas
- Estados de sesión

## 9. Credenciales de Prueba
### Cliente:
Registrar uno nuevo desde la app.

### Administrador:
- Seleccionar “LOGIN ADMIN”


## 10. Guía de Uso
1. Seleccionar tipo de acceso.
2. Iniciar sesión o registrarse.
3. Visualizar cartas.
4. Completar una reserva.
5. Confirmar.
6. (Admin) Revisar panel de control.



