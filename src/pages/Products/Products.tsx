// =============================================================================
// pages/Products/Products.tsx
// -----------------------------------------------------------------------------
// Página que muestra TODOS los productos, con:
//   - Un buscador por nombre.
//   - Un filtro por categoría (puede venir precargado desde la URL, si el
//     usuario llegó aquí haciendo clic en una CategoryCard del Home).
//   - Un selector de orden por precio.
//
// Conceptos de React explicados en detalle en este archivo:
//   - useState: crear variables reactivas para búsqueda/filtro/orden.
//   - useMemo: evitar recalcular listas filtradas en cada render si nada
//     relevante cambió.
//   - filter(): quedarnos solo con los productos que cumplen una condición.
//   - map(): transformar cada producto en un componente <ProductCard>.
//   - sort(): ordenar la lista según el precio.
// =============================================================================

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import type { OrdenPrecio } from "../../types";
import styles from "./Products.module.css";

export function Products() {
  const { productos, cargando } = useProducts();

  // useSearchParams (de React Router) nos permite leer y escribir los
  // parámetros de la URL, ej: /productos?categoria=jeans
  // Esto es lo que permite que un link desde el Home ("Ver Jeans") llegue
  // aquí con el filtro YA aplicado, simplemente leyendo la URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaDesdeURL = searchParams.get("categoria") ?? "todas";

  // ---------------------------------------------------------------------
  // useState: cada uno de estos valores es una "variable reactiva".
  // Cuando cambian (por ejemplo, al escribir en el buscador), React vuelve
  // a ejecutar el componente completo (un "re-render") para reflejar el
  // nuevo valor en pantalla.
  // ---------------------------------------------------------------------
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaDesdeURL);
  const [orden, setOrden] = useState<OrdenPrecio>("ninguno");

  function cambiarCategoria(nuevaCategoria: string) {
    setCategoriaSeleccionada(nuevaCategoria);
    // Mantenemos la URL sincronizada con el filtro elegido, para que se
    // pueda compartir el link o recargar la página sin perder el filtro.
    setSearchParams(nuevaCategoria === "todas" ? {} : { categoria: nuevaCategoria });
  }

  // -----------------------------------------------------------------------
  // useMemo: "memoriza" (guarda en caché) el resultado de un cálculo, y
  // solo lo vuelve a calcular si alguna de sus DEPENDENCIAS cambió (el
  // arreglo al final: [productos, busqueda, categoriaSeleccionada, orden]).
  //
  // ¿Por qué es útil aquí? Filtrar y ordenar una lista es un cálculo que
  // se repite en cada render. Si el componente se re-renderiza por OTRA
  // razón (por ejemplo, algo del carrito cambia en otro lado), no queremos
  // recalcular el filtro innecesariamente. useMemo evita ese trabajo extra.
  //
  // Para una lista de 8 productos esto no se nota en rendimiento, pero es
  // el patrón correcto a aprender para cuando la lista tenga miles de
  // elementos.
  // -----------------------------------------------------------------------
  const productosFiltrados = useMemo(() => {
    let resultado = productos;

    // filter() recorre el arreglo y devuelve uno NUEVO solo con los
    // elementos que cumplen la condición (la función retorna true/false).
    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );
    }

    if (busqueda.trim() !== "") {
      const textoBusqueda = busqueda.trim().toLowerCase();
      resultado = resultado.filter((producto) =>
        producto.nombre.toLowerCase().includes(textoBusqueda)
      );
    }

    // sort() ordena el arreglo. Le pasamos una función que compara dos
    // elementos (a, b) y devuelve:
    //   - un número negativo si "a" debe ir ANTES que "b"
    //   - un número positivo si "a" debe ir DESPUÉS que "b"
    //   - cero si da igual el orden entre ambos
    //
    // OJO: sort() modifica el arreglo original, por eso usamos [...resultado]
    // para trabajar sobre una COPIA y no alterar accidentalmente el arreglo
    // "productos" que viene de nuestro hook.
    if (orden === "menor-a-mayor") {
      resultado = [...resultado].sort((a, b) => a.precio - b.precio);
    } else if (orden === "mayor-a-menor") {
      resultado = [...resultado].sort((a, b) => b.precio - a.precio);
    }

    return resultado;
  }, [productos, busqueda, categoriaSeleccionada, orden]);

  return (
    <main className="contenedor">
      <h1>Todos los productos</h1>
      <hr className="linea-costura" />

      {/* ---------------------------------------------------------------
          Barra de herramientas: buscador, filtro de categoría, orden.
      --------------------------------------------------------------- */}
      <div className={styles.barraHerramientas}>
        <SearchBar valor={busqueda} onCambio={setBusqueda} />

        <select
          value={categoriaSeleccionada}
          onChange={(evento) => cambiarCategoria(evento.target.value)}
          className={styles.selector}
          aria-label="Filtrar por categoría"
        >
          <option value="todas">Todas las categorías</option>
          <option value="poleras">Poleras</option>
          <option value="jeans">Jeans</option>
          <option value="chaquetas">Chaquetas</option>
          <option value="calzado">Calzado</option>
        </select>

        <select
          value={orden}
          onChange={(evento) => setOrden(evento.target.value as OrdenPrecio)}
          className={styles.selector}
          aria-label="Ordenar por precio"
        >
          <option value="ninguno">Ordenar por precio</option>
          <option value="menor-a-mayor">Precio: menor a mayor</option>
          <option value="mayor-a-menor">Precio: mayor a menor</option>
        </select>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* Resultado: lista filtrada/ordenada, o mensajes de estado.        */}
      {/* --------------------------------------------------------------- */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p className={styles.sinResultados}>
          No encontramos productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className={styles.grillaProductos}>
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
