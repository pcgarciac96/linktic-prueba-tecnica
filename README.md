# Prueba Técnica — Gestión de Métodos de Pago

Aplicación web Single Page Application (SPA) construida para la administración, consulta, filtrado, creación y edición de métodos de pago operativos. El proyecto está implementado bajo una arquitectura desacoplada y escalable, utilizando **Vue 3**, **TypeScript**, **Quasar Framework**, **Pinia** y **Vue Router**.

---

## 1. Descripción del Proyecto

El sistema proporciona una interfaz para la gestión operativa de métodos de pago en una plataforma transaccional. Permite a los administradores visualizar el estado de cada método, filtrar registros de forma reactiva, actualizar su disponibilidad operativa en tiempo real y gestionar la creación o modificación de opciones de pago mediante formularios modales validados.

### Funcionalidades implementadas:

- **Autenticación y Control de Acceso**: Inicio de sesión simulado, protección de rutas privadas mediante navigation guards y persistencia local de sesión.
- **Listado y Estado Operativo**: Visualización de métodos en una tabla reactiva con paginación, formato localizado de fechas, ordenamiento y conmutación de estado activo/inactivo en tiempo real.
- **Filtros Reactivos Desacoplados**: Componente genérico y agnóstico al dominio que permite filtrar por nombre, tipo y estado booleano sin acoplar la vista al negocio.
- **Creación y Edición Centralizada**: Formulario modal reutilizable con validaciones de campos requeridos, protección de atributos inmutables y notificaciones visuales de éxito o error.

---

## 2. Stack Tecnológico

| Herramienta / Librería | Versión              | Propósito en el Proyecto                                              |
| ---------------------- | -------------------- | --------------------------------------------------------------------- |
| **Vue.js**             | `^3.5.22`            | Framework reactivo principal (Composition API y `<script setup>`)     |
| **TypeScript**         | `^6.0.0`             | Tipado estático estricto en toda la base de código                    |
| **Quasar Framework**   | `^2.32.3`            | Librería de componentes UI (QTable, QDialog, QForm, QToggle, Notify)  |
| **@quasar/app-vite**   | `^3.8.4`             | Herramienta de compilación, servidor de desarrollo y empaquetado Vite |
| **Pinia**              | `^4.0.2`             | Gestión de estado global reactivo (Auth y Métodos de Pago)            |
| **Vue Router**         | `^5.0.6`             | Enrutamiento en modo HTML5 History y guardias de navegación           |
| **ESLint & Prettier**  | `^10.8.0` / `^3.8.1` | Análisis estático de código, estándares de calidad y formato          |
| **vue-tsc**            | `^3.3.3`             | Chequeo estático de tipos para componentes Vue y archivos TypeScript  |

---

## 3. Requisitos Previos

- **Node.js**: Compatible con `^22.12` o `^24` (especificado en `package.json`). Se recomienda la versión activa de **Node.js 22 LTS** (definida en el archivo `.nvmrc` del proyecto: `22`).
- **npm**: Versión `10.x` o superior (incluida habitualmente con Node.js 22).

Si dispone del gestor de versiones **nvm**, active automáticamente la versión requerida ejecutando:

```bash
nvm use
```

---

## 4. Instalación

> **Importante**: Todo el desarrollo y las fases de la prueba técnica se encuentran implementadas en la rama **`feature/prueba-tecnica`**. Asegúrese de ubicarse en esta rama antes de continuar.

1. Clone el repositorio en su máquina local:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Acceda al directorio raíz del proyecto:

   ```bash
   cd linktic-prueba-tecnica
   ```

3. Cambie a la rama de trabajo de la prueba:

   ```bash
   git checkout feature/prueba-tecnica
   ```

4. Instale las dependencias del proyecto:

   ```bash
   npm install
   ```

---

## 5. Ejecución en Entorno de Desarrollo

Para iniciar el servidor de desarrollo local con recarga en caliente (HMR), ejecute:

```bash
npm run dev
```

La aplicación se compilará y estará disponible en su navegador en:
**http://localhost:9000**

---

## 6. Compilación para Producción

Para generar el paquete optimizado y minificado de producción (modo SPA), ejecute:

```bash
npm run build
```

Los artefactos listos para despliegue se generarán en el directorio `dist/spa`.

---

## 7. Credenciales de Prueba

Dado que la prueba técnica evalúa competencias de frontend, la autenticación y la persistencia se encuentran simuladas en memoria y en almacenamiento local. Puede acceder a la plataforma con las siguientes credenciales mock:

| Campo                  | Valor de Prueba     |
| ---------------------- | ------------------- |
| **Correo Electrónico** | `admin@example.com` |
| **Contraseña**         | `Admin123*`         |

> Los datos de prueba y la validación de contraseñas se encuentran centralizados en `src/mocks/user.mock.ts`.

---

## 8. Funcionalidades Detalladas por Módulo

### Módulo de Autenticación

- **Inicio de sesión**: Formulario con validación de obligatoriedad, formato de correo y feedback reactivo ante credenciales inválidas.
- **Guardias de navegación**: Intercepción de rutas privadas (`meta: { requiresAuth: true }`) redirigiendo a `/login`. Redirección automática de `/login` hacia `/payment-methods` si ya existe sesión activa.
- **Persistencia de sesión**: Restauración transparente del token y datos del usuario desde `localStorage` al recargar la aplicación.
- **Cierre de sesión**: Botón en la barra de navegación que elimina la sesión local y restablece el estado global en Pinia.

### Módulo de Métodos de Pago

- **Listado y Carga Asíncrona**: Lectura inicial simulada con latencia de red (500ms) y visualización de indicadores de carga (`QInnerLoading`).
- **Tabla Reactiva**: Columnas ordenables por nombre, tipo, estado y fecha de creación, con paginación nativa y slot de estado vacío cuando no hay resultados.
- **Conmutación Operativa (`QToggle`)**: Activación o desactivación inmediata sin recargar la página, controlando el identificador en proceso (`updatingId`) para evitar dobles peticiones.
- **Filtros Combinados**: Búsqueda por coincidencia de texto en nombre, selección de tipo y filtrado por estado (Activo / Inactivo), con botón para restablecer todos los criterios.
- **Creación de Métodos**: Modal persistente con validaciones de campos obligatorios, asignación automática de ID único, estado activo y fecha ISO 8601.
- **Edición de Métodos**: Apertura de modal con precarga reactiva de datos del registro seleccionado, permitiendo actualizar denominación, tipo y descripción mientras se salvaguardan los datos protegidos del modelo.

---

## 9. Arquitectura del Proyecto

La solución aplica el principio de **Separación de Responsabilidades** (SoC) dividiendo la lógica en cuatro capas unidireccionales:

```
Vistas y Componentes UI (Vue 3 / Quasar)
         │
         ▼
Capa de Estado Global (Pinia Stores)
         │
         ▼
Capa de Servicios y Abstracción (Services)
         │
         ▼
Fuente de Datos Mock (In-Memory Database / Mocks)
```

- **Capa UI**: No realiza peticiones directas ni manipula almacenamiento local. Únicamente renderiza datos recibidos por props o stores y emite acciones de usuario.
- **Capa Store (Pinia)**: Centraliza el estado reactivo, banderas de carga (`isLoading`, `isSubmitting`), mensajes de error y orquestación de operaciones asíncronas.
- **Capa de Servicios**: Abstracciones tipadas con métodos estáticos asíncronos que simulan retardos de red e inducen fallos controlados.
- **Sustitución Futura**: Para integrar una API REST o GraphQL real, únicamente se reemplaza la implementación interna en `src/services/` por llamadas HTTP (ej. `axios` o `fetch`), conservando intactos los contratos TypeScript, los Stores y las vistas.

---

## 10. Estructura de Carpetas

```
src/
├── boot/                      # Archivos de arranque de Quasar
├── components/
│   ├── common/                # Componentes genéricos reutilizables (AppFilters.vue)
│   └── payment-methods/       # Componentes propios del dominio (PaymentMethodForm.vue)
├── css/                       # Estilos globales y variables de Quasar (app.scss)
├── layouts/                   # Layouts principales de la interfaz (MainLayout.vue)
├── mocks/                     # Conjunto de datos semilla en memoria (user.mock.ts, payment-methods.mock.ts)
├── pages/                     # Páginas asociadas a rutas (LoginPage.vue, PaymentMethodsPage.vue)
├── router/                    # Configuración de Vue Router y navigation guards (index.ts, routes.ts)
├── services/                  # Servicios asíncronos simulados (auth.service.ts, payment-methods.service.ts)
├── stores/                    # Stores de Pinia (auth.store.ts, payment-methods.store.ts)
├── types/                     # Interfaces y contratos de tipos TypeScript (auth, filter, payment-method)
└── utils/                     # Funciones utilitarias (date-formatter.ts)
```

---

## 11. Gestión de Estado con Pinia

El proyecto implementa dos stores modulares:

1. **`useAuthStore`** (`src/stores/auth.store.ts`):
   - **Estado**: `user`, `token`, `isLoading`, `error`.
   - **Getters**: `isAuthenticated`, `currentUser`.
   - **Acciones**: `login()`, `logout()`, `restoreSession()`.
   - **Persistencia**: Manejo desacoplado de `localStorage` bajo la clave `auth_session`.

2. **`usePaymentMethodsStore`** (`src/stores/payment-methods.store.ts`):
   - **Estado**: `rawPaymentMethods`, `filters`, `isLoading`, `isSubmitting`, `updatingId`, `error`.
   - **Getters**:
     - `paymentMethods`: Lista filtrada reactivamente según los criterios vigentes.
     - `allPaymentMethods`, `totalCount`, `activeCount`.
   - **Acciones**:
     - `fetchPaymentMethods()`: Sincroniza los métodos de pago desde el servicio.
     - `createPaymentMethod()`: Agrega un nuevo registro al inicio de la colección reactiva.
     - `updatePaymentMethod()`: Modifica el elemento coincidente por ID en memoria.
     - `toggleStatus()`: Alterna el valor booleano `active` del registro indicado.
     - `applyFilters()` / `clearFilters()`: Actualiza o limpia los criterios de consulta.

---

## 12. Supuestos del Modelo de Negocio

Para asegurar coherencia técnica y consistencia en el dominio de la aplicación, se adoptaron los siguientes supuestos:

### 1. Identificador (`id: string`)

- **Supuesto**: Se modela como `string` alfanumérico (ej. `pm-001`, `pm-1726384920192`).
- **Justificación**: Representa de manera estándar identificadores universales (UUID v4 o identificadores generados por bases de datos documentales o distribuidas), evitando colisiones y facilitando la interoperabilidad con servicios backend externos.

### 2. Nombre (`name: string`)

- **Supuesto**: Campo obligatorio de texto plano.
- **Justificación**: Es la denominación principal visible para el usuario final y operador. En creación y edición se sanitiza eliminando espacios en blanco en los extremos (`trim()`). No se permiten nombres vacíos o compuestos únicamente por espacios.

### 3. Tipo (`type: PaymentMethodType`)

- **Supuesto**: Conjunto cerrado tipado mediante unión literal:
  ```ts
  type PaymentMethodType = 'CARD' | 'TRANSFER' | 'CASH' | 'WALLET';
  ```
- **Justificación**: Estandariza las categorías de pago admitidas en la pasarela. Cada tipo cuenta con su mapeo de etiqueta amigable y su icono representativo en la interfaz (`Tarjeta`, `Transferencia`, `Efectivo`, `Billetera digital`).

### 4. Estado Operativo (`active: boolean`)

- **Supuesto**: Valor booleano estricto: `true` para Activo y `false` para Inactivo.
- **Justificación**: Representa de forma binaria si el método está disponible para recibir transacciones en la pasarela. Al dar de alta un nuevo método, este se inicializa por defecto como `active: true`.

### 5. Fecha de Creación (`createdAt: string`)

- **Supuesto**: Cadena temporal con marca de tiempo en estándar **ISO 8601** UTC (ej. `2026-01-10T08:30:00.000Z`).
- **Justificación**: Permite almacenar fechas normalizadas independientes de la zona horaria del cliente. Para su renderizado visual, se formatea de manera localizada mediante `Intl.DateTimeFormat` (`es-CO`).

### 6. Descripción (`description: string`)

- **Supuesto**: Atributo de texto opcional en el formulario (`description?: string | undefined`), persistido internamente como `string` (vacío si no se proporciona).
- **Justificación**: Ofrece espacio para especificaciones operativas adicionales (condiciones bancarias, convenios de corresponsalía) sin impedir el registro cuando no se requiera una descripción extensa.

---

## 13. Tipado Estricto del Modelo

En `src/types/payment-method.types.ts` se definen interfaces separadas para cada momento del ciclo de vida de los datos, aplicando segregación de contratos:

```
PaymentMethod (Modelo Completo)
├── id: string                   (Inmutable - generado por sistema)
├── name: string                 (Obligatorio)
├── type: PaymentMethodType      ('CARD' | 'TRANSFER' | 'CASH' | 'WALLET')
├── description: string          (Opcional)
├── active: boolean              (Inmutable en formulario - gobernado por toggle)
└── createdAt: string            (Inmutable - asignado al crearse)
```

### Separación de Payloads:

- **`PaymentMethod`**: Representa la entidad completa y persistida.
- **`CreatePaymentMethodPayload`**: Atributos requeridos para registrar un método (`name`, `type`, `description?`).
- **`UpdatePaymentMethodPayload`**: Atributos editables permitidos (`name`, `type`, `description?`).

> **Seguridad de datos**: Los campos `id`, `createdAt` y `active` no están expuestos para edición dentro del formulario modal, garantizando la inmutabilidad de los metadatos de auditoría y estado.

---

## 14. Componente Genérico de Filtros (`AppFilters.vue`)

El componente `src/components/common/AppFilters.vue` fue desarrollado bajo un diseño desacoplado y reutilizable:

- **Configuración declarativa**: Recibe un arreglo de campos tipados (`fields: FilterField[]`) que define dinámicamente qué controles pintar (`text` o `select`).
- **Independencia del negocio**: No contiene referencias a entidades de pago (`PaymentMethod` o `active`). Puede utilizarse en cualquier otro módulo de la aplicación (ej. usuarios, órdenes, transacciones).
- **Preservación de valores válidos**: La función de validación interna excluye valores vacíos (`null`, `undefined`, cadenas en blanco) pero **conserva de forma estricta valores válidos como `false` y `0`**.
- **Comunicación DDAU**: Emite eventos `@search` con los filtros activos y `@clear` para restablecer la búsqueda, delegando la lógica de filtrado al store consumidor.

---

## 15. Formulario Reutilizable (`PaymentMethodForm.vue`)

El componente `src/components/payment-methods/PaymentMethodForm.vue` centraliza la creación y edición en un único componente:

- **Detección de modo reactivo**: Determina si opera en modo edición o creación evaluando la presencia de `props.paymentMethod.id`.
- **Aislamiento de estado local**: Clona los valores recibidos en un objeto reactivo propio mediante un observador inmediato (`watch`), garantizando que **las props nunca sean mutadas directamente**.
- **Limpieza y sincronización**: Al pasar de edición a creación o entre diferentes métodos, el formulario sincroniza los datos o limpia los campos automáticamente.
- **Validación Quasar**: Integra reglas nativas asíncronas con `<q-form>` antes de emitir `@save`.
- **Prevención de pérdida de datos**: Si el store reporta un fallo al persistir, el diálogo se mantiene abierto permitiendo al usuario corregir o reintentar.

---

## 16. Decisiones Técnicas Destacadas

1. **Arquitectura Desacoplada**: Estricta separación entre capas. La UI desconoce el origen de los datos y los servicios desconocen la existencia de la UI.
2. **TypeScript Estricto**: Configurado con `exactOptionalPropertyTypes: true` y sin uso de `any`, obligando a que cada propiedad opcional maneje explícitamente `undefined` y previniendo errores en tiempo de ejecución.
3. **Persistencia y Simulación de Latencia**: Los servicios mock implementan retardos realistas (`setTimeout` de 500-600ms) y devuelven copias profundas (`deep clone`) para simular el comportamiento real de una API HTTP externa.
4. **Experiencia de Usuario (UX)**: Diálogos persistentes para evitar pérdidas accidentales por clic exterior, toasts informativos no invasivos con el plugin `Notify` de Quasar, banners de error con botón de reintento y chips descriptivos con iconografía contextual.

---

## 17. Scripts Disponibles en el Proyecto

Todos los comandos se ejecutan a través de `npm`:

| Comando              | Descripción                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`        | Inicia el servidor de desarrollo de Quasar con Vite y HMR en el puerto `9000` |
| `npm run build`      | Compila y empaqueta la aplicación lista para producción en `dist/spa`         |
| `npm run typecheck`  | Ejecuta la verificación estática de tipos con `vue-tsc --noEmit`              |
| `npm run lint`       | Analiza, formatea y autocorrige el código con Prettier y ESLint               |
| `npm run lint:check` | Comprueba el estilo y reglas de linting sin modificar archivos                |
