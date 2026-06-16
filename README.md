# InterCommerce

SPA de e-commerce construida con React 19 + Vite + TypeScript. Permite explorar un catálogo de productos (con búsqueda, filtros por categoría y scroll infinito), ver el detalle de un producto, agregarlo al carrito y completar un flujo de checkout simulado.

## Arquitectura

El proyecto sigue una **arquitectura en capas**, donde cada carpeta tiene una responsabilidad clara y la lógica de negocio nunca vive dentro de los componentes. La idea es que un componente solo se preocupe de "qué se ve" y delegue el "qué hacer" a un hook.

```
src/
├── app/            # Configuración global: QueryClient y definición de rutas
├── pages/          # Vistas de alto nivel, componen hooks + componentes
├── components/     # UI pura, organizada por dominio (cart, checkout, products, ...)
├── hooks/          # Lógica de negocio, custom hooks y consumo de stores
├── services/       # Capa de red: fetch, interceptores de error, llamadas a la API
├── store/          # Estado global con Zustand (carrito, auth, checkout, UI, toasts)
├── lib/            # Funciones puras y testeables (cálculos, validaciones, formato)
├── types/          # Interfaces y tipos compartidos (Product, CartItem, etc.)
├── constants/      # Configuración y valores fijos del proyecto
└── test/           # Setup y utilidades compartidas para los tests
```

**¿Por qué esta separación?**

- **`services/`** se encarga únicamente de hablar con la API (`dummyjson.com`). Expone un `httpClient` con una clase `ApiError` que distingue errores 404 de otros errores de servidor, para que el resto de la app pueda reaccionar de forma consistente.
- **`hooks/`** es donde vive realmente el negocio: `useCart` decide si hay stock antes de agregar un producto, `useCheckout` orquesta todo el flujo de compra (sincroniza stock, valida sesión, confirma o cancela), `useProductFilters` sincroniza los filtros con la URL, etc. Si mañana cambia una regla de negocio, se cambia aquí y no hay que tocar la UI.
- **`components/`** son piezas de presentación. Reciben datos y callbacks por props, y en el peor caso hacen cálculos triviales de presentación (por ejemplo, el precio con descuento). No llaman servicios ni deciden reglas de negocio.
- **`lib/`** agrupa funciones puras (sin estado, sin efectos) como el cálculo de subtotal/IVA/total del carrito o el costo de envío. Al ser puras, son muy fáciles de testear de forma aislada.
- **`store/`** mantiene el estado global con Zustand, separado por dominio para que cada store sea pequeño y fácil de razonar.

## Librerías principales y por qué se elegieron

- **React 19 + React Compiler**: el compilador de React memoiza automáticamente buena parte de los componentes, así que combinamos eso con `React.memo`/`useMemo`/`useCallback` solo donde realmente aporta (listas que se re-renderizan seguido, cálculos derivados del carrito).
- **Vite (rolldown-vite)**: dev server con HMR instantáneo y build de producción muy rápido gracias al bundler basado en Rust.
- **TypeScript en modo estricto**: todas las respuestas de la API, el estado del carrito/checkout y las props de los componentes están tipadas con interfaces propias. No se usa `any` en ningún punto del proyecto.
- **Tailwind CSS v4**: utilidades para estilos rápidos y consistentes, con una paleta de marca definida vía `@theme` en `index.css`.
- **Zustand + persist**: estado global simple, sin el boilerplate de Redux. El middleware `persist` se usa para que el carrito, la sesión y los productos vistos recientemente sobrevivan a un refresh de página (LocalStorage).
- **TanStack Query**: maneja el estado del servidor (catálogo, categorías, detalle de producto) con caché, reintentos inteligentes (no reintenta en 404, sí en errores transitorios) e invalidación, evitando tener que reinventar loading/error states a mano.
- **React Router v7**: ruteo declarativo para las vistas de catálogo, detalle de producto y 404.
- **clsx**: combinar clases condicionales de Tailwind sin ensuciar el JSX con concatenaciones de strings.
- **Vitest + React Testing Library + jsdom**: suite de tests con una API compatible con Jest, integrada de forma nativa con Vite (mismo transform, misma config, sin pasos extra).

## Instalación y ejecución local

### Requisitos

- Node.js 20 o superior
- pnpm (el proyecto usa `pnpm-lock.yaml`). Si no lo tienes instalado:

  ```bash
  npm install -g pnpm
  ```

### Pasos

1. Clonar el repositorio y entrar a la carpeta del proyecto:

   ```bash
   git clone <url-del-repositorio>
   cd intercommerce
   ```

2. Instalar las dependencias:

   ```bash
   pnpm install
   ```

3. Levantar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

   Esto abre la app en `http://localhost:5173` (o el puerto que indique la terminal) con hot reload.

4. Generar el build de producción (incluye chequeo de tipos):

   ```bash
   pnpm build
   ```

5. Previsualizar ese build de forma local:

   ```bash
   pnpm preview
   ```

6. Revisar el código con ESLint:

   ```bash
   pnpm lint
   ```

## Pruebas (unitarias e integración)

Para correr toda la suite de pruebas una sola vez:

```bash
pnpm test
```

Si quieres que se vuelvan a ejecutar automáticamente mientras editas código:

```bash
pnpm test:watch
```

### Cobertura

Para generar el reporte de cobertura (resumen en terminal + HTML navegable en `coverage/`):

```bash
pnpm test:coverage
```

La carpeta `coverage/` está en `.gitignore` y no se versiona.

### Pruebas incluidas

La suite tiene dos pruebas de integración que cubren los flujos principales del negocio:

**`src/__tests__/addToCart.test.tsx` — Agregar al carrito**
Renderiza la app en la página de detalle de un producto, lo agrega al carrito y verifica que el subtotal, el IVA y el total del drawer se actualicen con los valores correctos.

**`src/__tests__/checkoutFlow.test.tsx` — Flujo de checkout completo**
Recorre el proceso completo: agregar un producto, iniciar sesión cuando se intenta confirmar la compra, completar la dirección de envío y el método de pago, verificar el total en el resumen y confirmar la compra. Valida que el carrito quede vacío y que aparezca el toast de confirmación.
