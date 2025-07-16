# Banco Acme - Banca en Línea

## Descripción General

Banco Acme es una aplicación web que permite a los usuarios gestionar su cuenta bancaria desde el navegador. Pueden registrarse, iniciar sesión, ver su saldo, hacer depósitos y retiros, y consultar su historial de transacciones. Todo funciona directamente en el navegador sin necesidad de un servidor.

## Características Principales

### Autenticación
- Registro de nuevos usuarios con datos personales.
- Inicio de sesión con validación de usuario y contraseña.
- Recuperación de contraseña por correo electrónico.

### Gestión de Cuentas
- Generación automática de número de cuenta.
- Visualización del perfil y saldo actual.

### Transacciones
- Depósitos de dinero con registro automático.
- Retiros con verificación de saldo.
- Historial de las últimas 10 transacciones con detalles.

### Interfaz de Usuario
- Aplicación de una sola página (**SPA**) usando JavaScript.
- Navegación rápida entre secciones sin recargar la página.
- Diseño adaptable para móviles y computadoras.
- Validación de formularios y mensajes de error o éxito.

## Almacenamiento de Datos

- **localStorage** del navegador guarda los datos de usuarios y transacciones.
- La sesión actual se gestiona en memoria mientras la aplicación está abierta.

## Requisitos Técnicos

- Funciona solo con archivos HTML, CSS y JavaScript.
- No necesita servidor ni base de datos.
- Puede alojarse en servicios gratuitos como **GitHub Pages**, **Netlify**, o **Replit**.

## Limitaciones de Seguridad

- Todo ocurre del lado del cliente (navegador), sin seguridad real.
- No es apto para uso bancario real, solo fines educativos o demostrativos.

## Posibles Mejoras Futuras

- Conexión con una base de datos real.
- Autenticación segura en servidor.
- Integración con APIs de bancos reales.
- Encriptación de datos y sesiones seguras.
