# Preguntas de profundidad técnica

---

## 1. Hydration / Caché: ¿Cómo manejarías la hidratación de datos si esta app pasara a un entorno de Next.js (SSR)?

El problema cuando se deseapasar a SSR es que el servidor renderiza la pagina con datos frescos y luego el cliente los vuelve a pedir desde cero, generando un parpadeo. La hidratación se puede manejar en este caso con TanStack Query, asi el servidor hace el fetch, serializa el caché con dehydrate(), lo manda embebido en el HTML y cuando el cliente arranca ya tiene los datos listos sin hacer alguna peticion de mas

En cuanto a qué renderizar dónde: el catálogo y el detalle de producto son candidatos naturales para el servidor (cambian poco, se pueden pre-renderizar o con ISR). El carrito y el checkout son estado del usuario, así que esos conviene mantenerlos del lado del cliente.

---

## 2. Seguridad: ¿Cómo sanitizarías los datos de la descripción del producto si la API permitiera HTML inyectado (evitar XSS)?

Por ahora esto no es un problema porque React escapa el contenido de texto automáticamente — si la API mandara `<script>alert('xss')</script>` se mostraría literalmente como texto, no se ejecutaría. El riesgo aparece solo si en algún momento usáramos `dangerouslySetInnerHTML` para renderizar HTML de verdad dentro de una descripción (negritas, listas, links, etc.).

Si llegara a pasar, la solución estándar es pasar el string por **DOMPurify** justo antes de renderizarlo. Esa librería le quita todo lo que puede ser peligroso — scripts, atributos como `onclick` o `onerror` — y deja solo el HTML inofensivo.


## 3. Escalabilidad: Si el carrito necesitara aplicarse a múltiples tiendas simultáneamente, ¿cómo refactorizarías tu store de estado global?

El store actualmente trabaja asumiendo que hay una sola tienda (un array plano de items y punto). Para manejar varias en paralelo se deberia agregar una dimension más al estado.

Si las tiendas conviven dentro de la misma app y la misma sesión, el cambio más directo es convertir `items` en un mapa: `Record<storeId, CartItem[]>`. Cada acción (`addItem`, `removeItem`, etc.) recibe el `storeId` y el hook `useCart(storeId)` filtra el estado que le corresponde. No es un cambio enorme y funciona bien cuando las tiendas comparten contexto.

Si en cambio las tiendas necesitan estar completamente aisladas entre sí, lo más limpio es crear una instancia de Zustand por tienda mediante una función de fábrica:

```ts
const createCartStore = (storeId: string) =>
  create(persist(..., { name: `cart-${storeId}` }));
```

De esta forma cada tienda tiene su propio estado, su propia clave en localStorage y no se pisan entre sí para nada. Es un poco más de setup al principio pero a la larga es mucho más fácil de mantener, de escalar y de testear en aislamiento.
