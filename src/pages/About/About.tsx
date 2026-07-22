// =============================================================================
// pages/About/About.tsx
// -----------------------------------------------------------------------------
// Página "Nosotros", que también incluye la sección "Contacto" (usamos un
// ancla HTML normal, #contacto, para que el Header pueda enlazar
// directamente a esa sección sin necesitar una página aparte).
//
// Esta página también muestra un resumen simple del carrito de compras,
// para practicar cómo LEER y MODIFICAR el ShoppingContext desde una
// página distinta de donde se agregaron los productos (Home/Products).
// Esto demuestra el valor real de la Context API: el carrito "viaja" con
// el usuario sin importar en qué página esté.
// =============================================================================

import { useShopping } from "../../context/ShoppingContext";
import styles from "./About.module.css";

const formateadorPrecio = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function About() {
  const { items, eliminarProducto, vaciarCarrito, cantidadTotal } = useShopping();

  // reduce() para calcular el total a pagar, sumando (precio * cantidad)
  // de cada item del carrito.
  const totalAPagar = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <main className="contenedor">
      <section className={styles.seccion}>
        <h1>Nosotros</h1>
        <hr className="linea-costura" />
        <p className={styles.parrafo}>
          Moda Local nació como un pequeño puesto de feria hace más de 15
          años, y hoy es la tienda de ropa de barrio favorita del sector,
          ofreciendo prendas de calidad a precios justos, con atención
          cercana y personalizada.
        </p>
        <p className={styles.parrafo}>
          Este sitio en particular es un PROYECTO DE APRENDIZAJE: no existe
          una tienda real detrás. Su objetivo es enseñar React, TypeScript,
          Vite y Tauri mediante un caso de uso realista y entretenido.
        </p>
      </section>

      {/* El "id" en la etiqueta permite que un link como
          "/nosotros#contacto" haga scroll automático hasta aquí. */}
      <section id="contacto" className={styles.seccion}>
        <h2>Contacto</h2>
        <hr className="linea-costura" />
        <p className={styles.parrafo}>📍 Av. Los Aromos 482, esquina con Pje. Las Rosas</p>
        <p className={styles.parrafo}>📞 +56 9 1234 5678</p>
        <p className={styles.parrafo}>✉️ contacto@modalocal.example</p>
      </section>

      <section className={styles.seccion}>
        <h2>Tu carrito</h2>
        <hr className="linea-costura" />

        {items.length === 0 ? (
          <p className={styles.parrafo}>Tu carrito está vacío por ahora.</p>
        ) : (
          <>
            <ul className={styles.listaCarrito}>
              {items.map((item) => (
                <li key={item.id} className={styles.itemCarrito}>
                  <span>
                    {item.nombre} × {item.cantidad}
                  </span>
                  <span className={styles.subtotal}>
                    {formateadorPrecio.format(item.precio * item.cantidad)}
                  </span>
                  <button
                    className={styles.botonQuitar}
                    onClick={() => eliminarProducto(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <p className={styles.total}>
              Total ({cantidadTotal} unidades): {formateadorPrecio.format(totalAPagar)}
            </p>

            <button className={styles.botonVaciar} onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
          </>
        )}
      </section>
    </main>
  );
}
