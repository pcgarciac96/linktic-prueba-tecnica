# Linktic Prueba Técnica - Gestión de Métodos de Pago

Aplicación frontend construida con **Vue 3**, **Quasar Framework v2**, **TypeScript**, **Pinia** y **Vue Router**.

## Módulo de Autenticación y Seguridad (Fase 2)

La aplicación implementa un flujo completo de autenticación desacoplada con simulación asíncrona (mock service) y persistencia de sesión en `localStorage`.

### Credenciales Mock de Acceso

| Campo                  | Valor               |
| ---------------------- | ------------------- |
| **Correo Electrónico** | `admin@example.com` |
| **Contraseña**         | `Admin123*`         |

> [!NOTE]
> Las credenciales de prueba están en `src/mocks/user.mock.ts` y desacopladas de las vistas.

---

## Módulo de Gestión de Métodos de Pago (Fase 3)

Módulo de consulta y administración de métodos de pago:

- **Carga asíncrona**: Simulación de petición HTTP con latencia de 500ms y manejo de errores.
- **Tabla reactiva (`QTable`)**: Muestra Nombre, Tipo (con etiquetas e íconos amigables), Estado (`QBadge` Activo/Inactivo), Fecha de creación formateada y Acciones.
- **Conmutación reactiva (`QToggle`)**: Cambio de estado en tiempo real mediante Pinia sin recargar la página.
- **Estados de UI**: Feedback visual para carga (`QInnerLoading`), error (`QBanner` con reintento) y estado vacío (`#no-data`).

---

## Requisitos Previos

- **Node.js**: `>= 22.22.0` (definido en `.nvmrc`)
- **npm**: `>= 10.9.0`

Si utiliza `nvm`, activa la versión compatible con:

```bash
nvm use
```

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Verificación de TypeScript
npm run typecheck

# Verificación de linter y formato
npm run lint:check

# Compilar para producción (SPA)
npm run build
```
