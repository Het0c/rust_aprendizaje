// =============================================================================
// services/productService.ts
// -----------------------------------------------------------------------------
// ¿Qué es un "servicio"?
// Es un archivo cuya única responsabilidad es OBTENER DATOS, sin saber nada
// de cómo se van a mostrar en pantalla. Los componentes le piden datos al
// servicio, y el servicio decide de dónde sacarlos (JSON local, una API,
// una base de datos, etc.) Esto se llama "separación de responsabilidades".
//
// ¿Por qué es importante esta separación?
// Porque el día de mañana, si cambiamos "leer un archivo JSON" por
// "llamar a una API real con fetch()", SOLO tenemos que modificar este
// archivo. Ningún componente ni página necesita cambiar, porque ellos
// solo conocen las funciones de este servicio (getProductos, etc.), no
// de dónde vienen los datos.
//
// ---------------------------------------------------------------------------
// EN UNA APP REAL (con backend):
// ---------------------------------------------------------------------------
// En vez de hacer "import productosJSON from '../data/products.json'",
// tendríamos algo así:
//
//   export async function getProductos(): Promise<Producto[]> {
//     const respuesta = await fetch("https://api.modalocal.com/productos");
//     if (!respuesta.ok) throw new Error("Error al obtener productos");
//     return await respuesta.json();
//   }
//
// ¿Por qué normalmente los datos vienen de una API y no de un archivo JSON?
// - Los productos, precios y stock cambian constantemente y muchas personas
//   (empleados, sistemas de bodega) los actualizan al mismo tiempo. Un
//   archivo JSON local no se puede compartir ni actualizar en tiempo real.
// - Una API centraliza los datos en un servidor: todos los clientes de la
//   tienda (la app de escritorio, una futura app móvil, la página web) ven
//   SIEMPRE la misma información actualizada.
// - Permite seguridad: no cualquiera puede editar el catálogo, solo quien
//   tenga permisos, algo que un archivo JSON local no puede controlar.
//
// En este proyecto de aprendizaje usamos JSON local para que puedas correr
// todo sin necesitar internet ni un servidor, pero la estructura de este
// archivo ya está preparada para que algún día reemplaces su interior por
// llamadas fetch() reales, sin tocar el resto de la aplicación.
// =============================================================================

import type { Producto, Categoria, Oferta } from "../types";

// Importamos el JSON directamente. Gracias a "resolveJsonModule": true en
// tsconfig.json, TypeScript nos deja tratar el JSON como si fuera un
// arreglo de objetos ya tipado.
import productosJSON from "../data/products.json";
import categoriasJSON from "../data/categories.json";
import ofertasJSON from "../data/offers.json";

/**
 * Simula una "espera de red" para que se sienta parecido a una llamada
 * real a una API (que normalmente tarda un poco en responder). Esto es
 * MUY útil para poder practicar estados de "cargando..." en la interfaz.
 */
function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/** Obtiene todos los productos. Devuelve una Promise, como lo haría fetch(). */
export async function getProductos(): Promise<Producto[]> {
  await esperar(300); // Pequeño retraso simulado.
  return productosJSON as Producto[];
}

/** Obtiene un único producto según su id (usado en la página de Detalle). */
export async function getProductoPorId(id: number): Promise<Producto | undefined> {
  await esperar(200);
  return (productosJSON as Producto[]).find((producto) => producto.id === id);
}

/** Obtiene todas las categorías disponibles. */
export async function getCategorias(): Promise<Categoria[]> {
  await esperar(150);
  return categoriasJSON as Categoria[];
}

/** Obtiene la oferta/promoción activa para mostrar en el banner principal. */
export async function getOfertaActiva(): Promise<Oferta | undefined> {
  await esperar(150);
  return (ofertasJSON as Oferta[]).find((oferta) => oferta.activa);
}
