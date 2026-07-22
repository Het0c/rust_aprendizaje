// =============================================================================
// components/Header/Header.tsx
// -----------------------------------------------------------------------------
// Este componente solamente RENDERIZA el encabezado del sitio: el logo, el
// nombre de la tienda y la barra de navegación.
// No conoce cómo se obtienen los productos ni ninguna otra lógica de negocio.
// Su única responsabilidad es mostrar la navegación y el contador del carrito.
//
// Conceptos usados aquí:
// - Componente funcional: es simplemente una función de JavaScript/TypeScript
//   que retorna JSX (código parecido a HTML, pero que en realidad es
//   JavaScript "disfrazado").
// - <Link> de React Router: reemplaza a la etiqueta <a> normal. La razón es
//   que <a href="..."> recargaría TODA la página (perdiendo el estado de
//   React), mientras que <Link> cambia de página SIN recargar, manteniendo
//   la aplicación funcionando como una SPA (Single Page Application).
// =============================================================================

import { Link } from "react-router-dom";
import { useShopping } from "../../context/ShoppingContext";
import styles from "./Header.module.css";

export function Header() {
  // useShopping es nuestro hook personalizado que "escucha" el
  // ShoppingContext. Gracias a la Context API, el Header puede saber
  // cuántos productos hay en el carrito SIN que nadie le pase esa
  // información por props: la obtiene directamente del contexto global.
  const { cantidadTotal } = useShopping();

  return (
    <header className={styles.header}>
      <div className={`contenedor ${styles.contenido}`}>
        {/* ---------------------------------------------------------------
            Logo + nombre de la tienda.
            Lo envolvemos en un <Link to="/"> para que, como es costumbre
            en cualquier sitio, hacer clic en el logo lleve al Inicio.
        --------------------------------------------------------------- */}
        <Link to="/" className={styles.marca}>
          <span className={styles.logo} aria-hidden="true">
            🧵
          </span>
          <span className={styles.nombreTienda}>
            Moda Local
            <span className={styles.eslogan}>ropa de barrio</span>
          </span>
        </Link>

        {/* ---------------------------------------------------------------
            Barra de navegación. Cada <Link> apunta a una ruta distinta,
            definidas en App.tsx dentro de <Routes>.
        --------------------------------------------------------------- */}
        <nav className={styles.navegacion} aria-label="Navegación principal">
          <Link to="/" className={styles.enlace}>
            Inicio
          </Link>
          <Link to="/productos" className={styles.enlace}>
            Productos
          </Link>
          <Link to="/nosotros" className={styles.enlace}>
            Nosotros
          </Link>
          {/* La página "Contacto" pedida en el enunciado la resolvemos
              como una sección dentro de "Nosotros" para no multiplicar
              páginas casi vacías; se explica en README. */}
          <Link to="/nosotros#contacto" className={styles.enlace}>
            Contacto
          </Link>
        </nav>

        {/* Contador simple del carrito: número total de unidades. */}
        <div className={styles.carrito} title="Productos en el carrito">
          🛍️ <span className={styles.contadorCarrito}>{cantidadTotal}</span>
        </div>
      </div>
    </header>
  );
}
