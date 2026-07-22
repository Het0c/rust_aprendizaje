// =============================================================================
// types.ts
// -----------------------------------------------------------------------------
// TypeScript nos permite describir la "forma" que deben tener nuestros datos.
// Esto se llama definir un "tipo" o "interfaz".
//
// ¿Para qué sirve esto?
// 1. Si escribimos mal el nombre de un campo (ej: "precio" -> "precioo"),
//    TypeScript nos avisa ANTES de ejecutar el código, no después.
// 2. El editor de código (VS Code, etc.) nos autocompleta los campos.
// 3. Sirve como documentación: cualquiera que lea este archivo entiende
//    exactamente qué información maneja un "Producto" o una "Categoria".
//
// Centralizamos los tipos aquí para que TODOS los componentes, páginas y
// servicios usen exactamente la misma definición (evita duplicar código).
// =============================================================================

/** Representa un producto de la tienda, tal como viene en products.json */
export interface Producto {
  id: number;
  nombre: string;
  categoria: string; // Coincide con el "id" de una Categoria (ej: "poleras").
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
}

/** Representa una categoría de ropa, tal como viene en categories.json */
export interface Categoria {
  id: string;
  nombre: string;
  icono: string; // Emoji usado como ícono simple (sin necesidad de imágenes).
}

/** Representa una oferta/promoción del banner principal, desde offers.json */
export interface Oferta {
  id: string;
  titulo: string;
  descripcion: string;
  activa: boolean;
}

/**
 * Representa un producto dentro del carrito de compras.
 * Extendemos (reutilizamos) Producto y le agregamos la cantidad elegida.
 */
export interface ItemCarrito extends Producto {
  cantidad: number;
}

/** Criterios posibles para ordenar la lista de productos por precio. */
export type OrdenPrecio = "ninguno" | "menor-a-mayor" | "mayor-a-menor";
