// =============================================================================
// pages/Home/Home.tsx
// -----------------------------------------------------------------------------
// Una "página" es un componente especial que representa una RUTA completa
// de la aplicación (ej: "/"). Se diferencia de un componente normal en que
// una página normalmente COMBINA varios componentes más pequeños
// (CategoryCard, ProductCard, etc.) y es quien decide QUÉ datos pedirle a
// los hooks/servicios.
//
// Esta es la página de Inicio. Muestra:
//   1. Un banner con la promoción activa.
//   2. Las categorías disponibles.
//   3. Un listado de productos destacados.
//   4. Una demostración de cómo React "llama" a Rust mediante Tauri.
// =============================================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CategoryCard } from "../../components/CategoryCard/CategoryCard";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { getCategorias, getOfertaActiva } from "../../services/productService";
import type { Categoria, Oferta } from "../../types";
import styles from "./Home.module.css";

// Cuántos productos "destacados" mostramos en el Home (el enunciado pide
// entre 6 y 8). Lo dejamos como una constante nombrada para que sea fácil
// de encontrar y ajustar.
const CANTIDAD_PRODUCTOS_DESTACADOS = 6;

export function Home() {
  // Reutilizamos nuestro hook personalizado: así NO repetimos la lógica
  // de "cargando/error/datos" que ya escribimos una vez en useProducts.
  const { productos, cargando } = useProducts();

  // Para categorías y ofertas, como son datos más simples y usados solo
  // aquí, usamos useState + useEffect directamente en la página (no
  // amerita crear un hook nuevo para esto, ver la explicación en
  // hooks/useProducts.ts sobre cuándo SÍ conviene crear un hook).
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [oferta, setOferta] = useState<Oferta | null>(null);

  useEffect(() => {
    getCategorias().then(setCategorias);
    getOfertaActiva().then((resultado) => setOferta(resultado ?? null));
  }, []); // [] = solo al montar el componente, una vez.

  // ---------------------------------------------------------------------
  // Sección de demostración: React llamando a un comando de Rust (Tauri).
  // ---------------------------------------------------------------------
  const [nombreVisitante, setNombreVisitante] = useState("");
  const [saludoDesdeRust, setSaludoDesdeRust] = useState<string | null>(null);

  async function saludarDesdeRust() {
    // invoke() es la función que provee el paquete @tauri-apps/api.
    // Le decimos: "ejecuta el comando llamado 'saludar' en Rust, pasándole
    // este objeto de argumentos". El nombre del comando ("saludar") y el
    // nombre del argumento ("nombre") DEBEN coincidir exactamente con lo
    // que definimos en src-tauri/src/lib.rs.
    //
    // invoke() devuelve una Promise, por eso usamos await: el código en
    // JavaScript/React se "pausa" ahí hasta que Rust responde, sin bloquear
    // el resto de la interfaz.
    const nombreAEnviar = nombreVisitante.trim() || "vecino/a";
    const respuesta = await invoke<string>("saludar", { nombre: nombreAEnviar });
    setSaludoDesdeRust(respuesta);
  }

  // Tomamos solo los primeros N productos como "destacados". slice() crea
  // un nuevo arreglo con una porción del original, sin modificar el
  // arreglo original (a diferencia de otros métodos como splice()).
  const productosDestacados = productos.slice(0, CANTIDAD_PRODUCTOS_DESTACADOS);

  return (
    <main>
      {/* ------------------------------------------------------------ */}
      {/* 1) BANNER PRINCIPAL con la promoción activa                   */}
      {/* ------------------------------------------------------------ */}
      {oferta && (
        <section className={styles.banner}>
          <div className="contenedor">
            <p className={styles.etiquetaBanner}>Promoción</p>
            <h1 className={styles.tituloBanner}>{oferta.titulo}</h1>
            <p className={styles.descripcionBanner}>{oferta.descripcion}</p>
          </div>
        </section>
      )}

      <div className="contenedor">
        {/* -------------------------------------------------------- */}
        {/* 2) CATEGORÍAS                                              */}
        {/* -------------------------------------------------------- */}
        <section className={styles.seccion}>
          <h2>Categorías</h2>
          <hr className="linea-costura" />
          <div className={styles.grillaCategorias}>
            {/* map() recorre el arreglo "categorias" y por cada elemento
                devuelve un componente <CategoryCard>. La prop especial
                "key" ayuda a React a identificar cada elemento de la lista
                de forma eficiente al re-renderizar (debe ser única). */}
            {categorias.map((categoria) => (
              <CategoryCard key={categoria.id} categoria={categoria} />
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* 3) PRODUCTOS DESTACADOS                                    */}
        {/* -------------------------------------------------------- */}
        <section className={styles.seccion}>
          <h2>Productos destacados</h2>
          <hr className="linea-costura" />

          {/* Renderizado condicional: mostramos un mensaje mientras los
              datos aún no llegan (cargando === true). Esto simula la
              experiencia real de esperar una respuesta de una API. */}
          {cargando ? (
            <p>Cargando productos...</p>
          ) : (
            <div className={styles.grillaProductos}>
              {productosDestacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/* 4) DEMOSTRACIÓN: REACT LLAMANDO A UN COMANDO DE RUST       */}
        {/* -------------------------------------------------------- */}
        <section className={styles.seccion}>
          <h2>Saludo desde Rust 🦀</h2>
          <hr className="linea-costura" />
          <p className={styles.textoExplicativo}>
            Este pequeño formulario NO usa JavaScript para generar el saludo:
            le envía tu nombre a una función escrita en Rust (el comando
            <code> saludar</code>, en <code>src-tauri/src/lib.rs</code>), y
            Rust le responde el texto a React. Así es como Tauri conecta la
            interfaz (React) con la lógica nativa (Rust).
          </p>
          <div className={styles.demoRust}>
            <input
              type="text"
              placeholder="Escribe tu nombre..."
              value={nombreVisitante}
              onChange={(evento) => setNombreVisitante(evento.target.value)}
              className={styles.inputDemo}
            />
            <button onClick={saludarDesdeRust} className={styles.botonDemo}>
              Saludar desde Rust
            </button>
          </div>
          {saludoDesdeRust && <p className={styles.respuestaRust}>{saludoDesdeRust}</p>}
        </section>
      </div>
    </main>
  );
}
