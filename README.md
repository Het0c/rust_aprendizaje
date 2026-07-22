# Moda Local 🧵 — Proyecto de aprendizaje (Tauri 2 + React + TypeScript + Vite)

Este proyecto simula la página principal de una tienda de ropa de barrio.
**No es una aplicación real**: es una plantilla de aprendizaje pensada para
que entiendas, línea por línea, cómo funciona React dentro de Tauri.

No hay backend. Todos los "datos de la tienda" viven en archivos JSON dentro
de `src/data/`, simulando una base de datos.

---

## 1. Cómo ejecutar el proyecto

Requisitos previos:
- [Node.js](https://nodejs.org/) 18 o superior.
- [Rust](https://www.rust-lang.org/tools/install) instalado (Tauri lo necesita
  para compilar la parte nativa de la app).
- Dependencias del sistema operativo que pide Tauri 2 (revisa la
  [guía oficial de prerrequisitos](https://v2.tauri.app/start/prerequisites/)
  según tu sistema operativo: Windows, macOS o Linux).

Pasos:

```bash
npm install       # Instala las dependencias de React/Vite (package.json)
npm run tauri dev # Levanta Vite + compila Rust + abre la ventana de la app
```

La primera vez que ejecutes `npm run tauri dev`, Rust va a compilar (puede
tardar varios minutos). Las siguientes veces será mucho más rápido.

> Nota sobre íconos: `tauri.conf.json` referencia unos íconos en
> `src-tauri/icons/` que este proyecto de aprendizaje NO incluye (para no
> llenarlo de archivos binarios). Esto no afecta a `npm run tauri dev`. Si
> más adelante quieres generar un instalador con `npm run tauri build`,
> genera antes los íconos reales con `npx tauri icon ruta/a/tu-logo.png`.

---

## 2. ¿Qué es Tauri, en simple?

Una aplicación de escritorio hecha con Tauri tiene **dos mundos** que
trabajan juntos:

| Mundo | Tecnología | Qué hace | Dónde vive |
|---|---|---|---|
| Interfaz (lo que ves) | React + TypeScript + CSS | Dibuja botones, tarjetas, texto, maneja clics | `src/` |
| Núcleo nativo | Rust | Crea la ventana real del sistema operativo, y puede acceder a archivos, red de bajo nivel, notificaciones, etc. | `src-tauri/` |

React **no sabe** que existe Rust. Simplemente se ejecuta como si estuviera
en un navegador normal, dentro de una ventana que Tauri le proporciona.

Rust, por su parte, expone funciones llamadas **comandos** (`#[tauri::command]`)
que React puede invocar como si fueran funciones de JavaScript, usando la
función `invoke()` del paquete `@tauri-apps/api`. Este proyecto incluye un
comando de ejemplo llamado `saludar`, que puedes ver en acción en la sección
"Saludo desde Rust" de la página de Inicio.

**Flujo completo del comando `saludar`:**
1. Escribes tu nombre en el input de la página de Inicio (`src/pages/Home/Home.tsx`).
2. Al hacer clic en el botón, React llama a `invoke("saludar", { nombre: "..." })`.
3. Tauri envía ese mensaje al proceso de Rust.
4. Rust ejecuta la función `saludar()` definida en `src-tauri/src/lib.rs` y
   devuelve un `String`.
5. Esa respuesta vuelve a React como si fuera el resultado de una `Promise`,
   y la mostramos en pantalla.

### Archivos clave de la parte Rust

- **`src-tauri/src/main.rs`**: el punto de entrada mínimo del programa. Solo
  llama a `run()`.
- **`src-tauri/src/lib.rs`**: aquí vive la lógica real, incluyendo el comando
  `saludar` y el registro de comandos (`invoke_handler`).
- **`src-tauri/build.rs`**: script que se ejecuta antes de compilar, usado
  internamente por Tauri.
- **`src-tauri/Cargo.toml`**: el "package.json" de Rust: declara el nombre
  del proyecto y las dependencias (`tauri`, `serde`, etc.).
- **`src-tauri/tauri.conf.json`**: la configuración central de Tauri. Como
  el JSON no admite comentarios, aquí va la explicación de cada campo:
  - `build.devUrl`: la URL donde Tauri va a buscar la app mientras
    desarrollas (`npm run tauri dev`). Debe coincidir con el puerto de
    `vite.config.ts` (1420).
  - `build.beforeDevCommand` / `beforeBuildCommand`: comandos que Tauri
    ejecuta automáticamente antes de abrir la ventana de desarrollo o antes
    de construir la app final (en este caso, corren Vite).
  - `build.frontendDist`: la carpeta donde queda el resultado final de
    `npm run build` (los archivos HTML/CSS/JS listos para producción).
  - `app.windows`: configuración de la ventana nativa (título, tamaño,
    si se puede redimensionar).
  - `app.security.csp`: política de seguridad de contenido. La dejamos en
    `null` por simplicidad en este proyecto educativo (en una app real de
    producción conviene definirla).
  - `bundle`: configuración para cuando empaquetas la app final (instalador
    `.exe`, `.dmg`, `.deb`, etc.), incluyendo el ícono.

---

## 3. ¿Por qué esta estructura de carpetas?

```
src/
  components/   Piezas de UI reutilizables y "tontas" (no saben de dónde
                vienen los datos, solo los reciben por props).
  pages/        Componentes que representan una URL completa. Combinan
                varios components/ y deciden qué datos pedir.
  hooks/        Lógica reutilizable que usa useState/useEffect internamente,
                para no repetir el mismo código en varias páginas.
  context/      Estado GLOBAL de la aplicación (en este caso, el carrito),
                accesible desde cualquier componente sin pasar props manualmente.
  services/     Funciones que OBTIENEN datos (hoy desde JSON local, mañana
                podrían venir de una API real) y esconden ese detalle del
                resto de la app.
  data/         Los archivos JSON que simulan la base de datos de la tienda.
  styles/       CSS global y variables de diseño (colores, tipografías,
                espaciados) compartidas por toda la app.
  assets/       Carpeta reservada para imágenes/íconos propios del proyecto
                (en este ejemplo usamos imágenes de marcador de posición
                cargadas por URL, por eso está vacía).
  App.tsx       Componente raíz: define las rutas y envuelve todo con el
                ShoppingProvider.
  main.tsx      Punto de entrada: monta React dentro del index.html.
```

Cada carpeta separa una **responsabilidad distinta**. Esta separación es lo
que permite que el proyecto crezca sin volverse un caos: si necesitas
cambiar CÓMO se ven las tarjetas de producto, sabes que solo debes tocar
`components/ProductCard/`. Si necesitas cambiar DE DÓNDE vienen los
productos, sabes que solo debes tocar `services/productService.ts`.

---

## 4. ¿Por qué los datos "deberían" venir de una API?

En este proyecto, `services/productService.ts` lee los productos desde
`src/data/products.json`. En una tienda real, esos datos casi siempre
vendrían de una API (un servidor) en vez de un archivo local, porque:

- El catálogo cambia constantemente (nuevos productos, cambios de stock y
  precio) y varias personas lo actualizan a la vez desde distintos lugares.
- Una API centraliza la información: la app de escritorio, una futura app
  móvil, y la página web pueden mostrar siempre los mismos datos
  actualizados, sin duplicar archivos.
- Permite control de acceso: no cualquiera puede modificar el catálogo,
  algo que un archivo JSON local no puede impedir.

El archivo `productService.ts` incluye, en sus comentarios, un ejemplo de
cómo se vería reemplazar el JSON local por una llamada real con `fetch()`.
Como el resto de la aplicación solo conoce las funciones del servicio
(`getProductos()`, etc.) y no de dónde vienen los datos, ese cambio no
afectaría a ningún componente ni página.

---

## 5. Conceptos de React explicados en el código

Cada archivo `.tsx` de este proyecto contiene comentarios explicando los
conceptos que usa, pero aquí va un resumen para tenerlo todo en un lugar:

- **JSX**: la sintaxis parecida a HTML que usamos dentro de archivos
  TypeScript/JavaScript (ej: `<div>Hola</div>`). No es HTML real: se
  transforma en llamadas a funciones de JavaScript que crean elementos.
- **Virtual DOM**: React mantiene una representación en memoria de la
  interfaz. Cuando algo cambia, React compara la versión nueva con la
  anterior y actualiza SOLO lo que cambió en la pantalla real, en vez de
  redibujar todo, lo que es mucho más rápido.
- **Componentes**: funciones que devuelven JSX. Son los "bloques de Lego"
  con los que armamos la interfaz (`Header`, `ProductCard`, `Home`, etc.)
- **Props**: los "parámetros" que le pasamos a un componente (ej: `producto`
  en `<ProductCard producto={producto} />`). Ver `ProductCard.tsx`.
- **Estado (`useState`)**: variables reactivas: cuando cambian, React vuelve
  a renderizar el componente automáticamente. Ver `hooks/useProducts.ts` y
  `pages/Products/Products.tsx`.
- **Efectos (`useEffect`)**: código que se ejecuta después de que el
  componente aparece en pantalla (o cuando cambian ciertos valores). Se usa
  típicamente para pedir datos. Ver `hooks/useProducts.ts`.
- **Memoización (`useMemo`)**: evita recalcular algo costoso si sus
  dependencias no cambiaron. Ver `pages/Products/Products.tsx`.
- **Eventos**: funciones que reaccionan a acciones del usuario (`onClick`,
  `onChange`). Ver `components/SearchBar/SearchBar.tsx`.
- **Context API**: estado compartido globalmente sin pasar props manualmente
  por cada nivel de componentes. Ver `context/ShoppingContext.tsx`.
- **Hooks personalizados**: funciones que empiezan con `use` y encapsulan
  lógica reutilizable. Ver `hooks/useProducts.ts`.
- **React Router** (`useParams`, `Link`, `Navigate`, `useSearchParams`): ver
  `pages/Product/Product.tsx` y `pages/Products/Products.tsx`.

---

## 6. Ideas para seguir practicando

Este proyecto es una base, no un producto terminado. Algunas ideas para
seguir aprendiendo modificándolo tú mismo/a:

- Agregar una página de "Checkout" que use los datos del `ShoppingContext`.
- Persistir el carrito usando `localStorage` (o, mejor aún, investigar el
  sistema de "storage" propio de Tauri).
- Agregar un segundo comando de Rust, por ejemplo uno que lea un archivo
  del sistema de archivos real usando el plugin `@tauri-apps/plugin-fs`.
- Reemplazar `productService.ts` por una versión que use `fetch()` contra
  una API pública de prueba, para practicar el flujo real con backend.

¡Diviértete explorando el código! 🎉
# rust_aprendizaje
