// =============================================================================
// pages/Product/Product.tsx
// -----------------------------------------------------------------------------
// Página de DETALLE de un producto. Se abre al hacer clic en "Ver detalles"
// desde una ProductCard, y su ruta está definida en App.tsx como:
//     /productos/:id
// El ":id" es un "parámetro dinámico de ruta": significa que esa parte de
// la URL puede ser cualquier valor (1, 2, 3, ...) y React Router lo
// captura por nosotros.
//
// Conceptos de React Router usados aquí:
//   - useParams(): lee los parámetros dinámicos de la URL actual.
//   - <Link>: navegación sin recargar la página (botón "Volver").
//   - <Navigate>: redirecciona automáticamente a otra ruta (lo usamos si
//     alguien entra a un id de producto que NO existe).
// =============================================================================

import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getProductoPorId } from "../../services/productService";
import { useShopping } from "../../context/ShoppingContext";
import type { Producto } from "../../types";
import styles from "./Product.module.css";

const formateadorPrecio = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function Product() {
  // useParams() nos devuelve un objeto con TODOS los parámetros dinámicos
  // definidos en la ruta. Como en App.tsx definimos la ruta como
  // "/productos/:id", aquí obtenemos exactamente { id: "3" } (siempre como
  // string, por eso más abajo lo convertimos a número con Number(id)).
  const { id } = useParams<{ id: string }>();

  const { agregarProducto } = useShopping();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [buscando, setBuscando] = useState(true);

  useEffect(() => {
    let estaMontado = true;

    async function buscarProducto() {
      setBuscando(true);
      const idComoNumero = Number(id);
      const resultado = await getProductoPorId(idComoNumero);
      if (estaMontado) {
        setProducto(resultado ?? null);
        setBuscando(false);
      }
    }

    buscarProducto();

    return () => {
      estaMontado = false;
    };
  }, [id]); // Si el usuario navega de un producto a otro, "id" cambia y
  // el efecto se vuelve a ejecutar para buscar el nuevo producto.

  // Mientras buscamos el producto, mostramos un mensaje simple.
  if (buscando) {
    return (
      <main className="contenedor">
        <p>Buscando producto...</p>
      </main>
    );
  }

  // Si terminamos de buscar y NO encontramos el producto (por ejemplo, el
  // usuario escribió una URL con un id inventado como /productos/9999),
  // usamos <Navigate> para redirigirlo automáticamente a la lista de
  // productos, en vez de mostrarle una página vacía o rota.
  //
  // "replace" evita que la página rota quede en el historial de
  // navegación (para que el botón "atrás" del usuario no vuelva a ella).
  if (!producto) {
    return <Navigate to="/productos" replace />;
  }

  return (
    <main className="contenedor">
      {/* Link (no <a>) para volver sin recargar toda la aplicación. */}
      <Link to="/productos" className={styles.volver}>
        ← Volver a productos
      </Link>

      <div className={styles.detalle}>
        <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />

        <div className={styles.info}>
          <h1>{producto.nombre}</h1>
          <p className={styles.precio}>{formateadorPrecio.format(producto.precio)}</p>
          <p className={styles.descripcion}>{producto.descripcion}</p>

          <p className={styles.stock}>
            {producto.stock > 0
              ? `Stock disponible: ${producto.stock} unidades`
              : "Sin stock por el momento"}
          </p>

          <button
            className={styles.botonAgregar}
            onClick={() => agregarProducto(producto)}
            disabled={producto.stock === 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
