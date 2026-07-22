// =============================================================================
// components/ProductCard/ProductCard.tsx
// -----------------------------------------------------------------------------
// Este componente solamente renderiza una tarjeta de producto.
// No conoce cómo se obtienen los datos, ni qué pasa cuando se hace clic
// en "Ver detalles" más allá de navegar a la página del producto.
// Solo recibe información mediante PROPS.
//
// ¿Qué son las "props"?
// Son los "parámetros" que le pasamos a un componente, igual que le pasarías
// argumentos a una función. Así, el MISMO componente ProductCard puede
// mostrar CUALQUIER producto, solo cambiando qué props recibe. Esto es
// reutilización de código: no escribimos una tarjeta distinta por cada
// producto, escribimos una sola plantilla flexible.
//
// Este componente es "tonto" a propósito (a veces se le llama componente
// de presentación o "dumb component"): no sabe de dónde vienen los datos,
// solo sabe cómo mostrarlos. La lógica de obtener productos vive en el
// hook useProducts y en el servicio productService.
// =============================================================================

import { Link } from "react-router-dom";
import type { Producto } from "../../types";
import { useShopping } from "../../context/ShoppingContext";
import styles from "./ProductCard.module.css";

// Definimos exactamente qué props espera recibir este componente.
interface ProductCardProps {
  producto: Producto;
}

// Formateador de moneda reutilizable (formatea números como "$9.990").
const formateadorPrecio = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function ProductCard({ producto }: ProductCardProps) {
  const { agregarProducto } = useShopping();

  return (
    <article className={styles.tarjeta}>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className={styles.imagen}
        loading="lazy"
      />

      <div className={styles.info}>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.precio}>{formateadorPrecio.format(producto.precio)}</p>

        <div className={styles.acciones}>
          {/* Link navega SIN recargar la página hacia /productos/:id.
              El id se arma dinámicamente usando "template literals"
              (comillas invertidas + ${...}). */}
          <Link to={`/productos/${producto.id}`} className={styles.botonVerMas}>
            Ver detalles
          </Link>

          {/* Este botón demuestra cómo un componente hijo (ProductCard)
              puede modificar el estado GLOBAL (el carrito) usando el
              contexto, sin necesitar que su componente padre le pase
              ninguna función por props. */}
          <button
            className={styles.botonAgregar}
            onClick={() => agregarProducto(producto)}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            + Carrito
          </button>
        </div>
      </div>
    </article>
  );
}
