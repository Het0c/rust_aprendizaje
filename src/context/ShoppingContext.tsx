// =============================================================================
// context/ShoppingContext.tsx
// -----------------------------------------------------------------------------
// ¿Qué problema resuelve la Context API?
// Normalmente, en React, los datos viajan de componente padre a componente
// hijo mediante "props". Pero ¿qué pasa si el Header (arriba de todo) necesita
// saber cuántos productos hay en el carrito, y ese carrito se modifica desde
// la página de Productos (mucho más abajo en el árbol)? Tendríamos que pasar
// props a través de MUCHOS componentes intermedios que ni siquiera usan esa
// información. A esto se le llama "prop drilling" y es incómodo y frágil.
//
// La Context API permite crear un "contenedor global" de datos (en este caso,
// el carrito de compras) al que CUALQUIER componente de la aplicación puede
// acceder directamente, sin importar cuán anidado esté, sin pasar props
// manualmente por cada nivel.
//
// Piensa en el Context como una "radio" que transmite datos: cualquier
// componente puede "sintonizarla" (usando el hook useShopping) sin necesitar
// un cable (props) que lo conecte directamente con la fuente.
// =============================================================================

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Producto, ItemCarrito } from "../types";

// -----------------------------------------------------------------------------
// 1) Definimos la "forma" de lo que el contexto va a compartir.
// -----------------------------------------------------------------------------
interface ShoppingContextType {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  cantidadTotal: number; // Cantidad total de unidades en el carrito.
}

// -----------------------------------------------------------------------------
// 2) Creamos el contexto en sí. Empieza en "undefined" porque todavía no
//    existe ningún "Provider" (proveedor) envolviendo la aplicación.
//    Lo comprobaremos más abajo en useShopping().
// -----------------------------------------------------------------------------
const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// 3) El "Provider" (proveedor) es un componente que ENVUELVE a toda (o parte)
//    de la aplicación y le da acceso a los datos del contexto. Lo usamos en
//    App.tsx envolviendo las rutas.
//
//    "children" es una prop especial de React: representa TODO lo que se
//    coloca dentro de las etiquetas del componente cuando se usa, por
//    ejemplo:
//        <ShoppingProvider>
//          <App />   <-- esto es "children"
//        </ShoppingProvider>
// -----------------------------------------------------------------------------
export function ShoppingProvider({ children }: { children: ReactNode }) {
  // Guardamos el carrito como un arreglo de ItemCarrito (producto + cantidad).
  const [items, setItems] = useState<ItemCarrito[]>([]);

  /**
   * Agrega un producto al carrito.
   * Si el producto YA estaba en el carrito, en vez de duplicarlo, aumentamos
   * su cantidad en 1. Si es nuevo, lo agregamos con cantidad = 1.
   */
  function agregarProducto(producto: Producto) {
    setItems((itemsActuales) => {
      const yaExiste = itemsActuales.find((item) => item.id === producto.id);

      if (yaExiste) {
        // map() recorre el arreglo y devuelve uno NUEVO, cambiando solo el
        // item que coincide con el id. En React NUNCA modificamos el estado
        // directamente (ej: yaExiste.cantidad++), siempre creamos una copia
        // nueva. Esto es lo que permite a React detectar el cambio y volver
        // a renderizar.
        return itemsActuales.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      // El operador spread (...producto) copia todas las propiedades del
      // producto dentro de un nuevo objeto, y le agregamos "cantidad: 1".
      return [...itemsActuales, { ...producto, cantidad: 1 }];
    });
  }

  /** Elimina por completo un producto del carrito, sin importar su cantidad. */
  function eliminarProducto(id: number) {
    // filter() devuelve un nuevo arreglo con todos los elementos que
    // CUMPLEN la condición. Aquí nos quedamos con todo lo que NO sea el
    // producto que queremos eliminar.
    setItems((itemsActuales) => itemsActuales.filter((item) => item.id !== id));
  }

  /** Vacía completamente el carrito. */
  function vaciarCarrito() {
    setItems([]);
  }

  // reduce() recorre el arreglo y lo "reduce" a un solo valor (en este caso,
  // la suma de todas las cantidades). Es útil para totales, sumas, promedios.
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);

  // El valor que compartimos con todos los componentes que "escuchen" este
  // contexto.
  const valor: ShoppingContextType = {
    items,
    agregarProducto,
    eliminarProducto,
    vaciarCarrito,
    cantidadTotal,
  };

  return (
    <ShoppingContext.Provider value={valor}>{children}</ShoppingContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 4) Hook personalizado para CONSUMIR el contexto fácilmente.
//    En vez de que cada componente escriba:
//        const contexto = useContext(ShoppingContext)
//    y tenga que lidiar con el caso "undefined", centralizamos esa
//    validación aquí. Así, cualquier componente simplemente hace:
//        const { items, agregarProducto } = useShopping();
// -----------------------------------------------------------------------------
export function useShopping(): ShoppingContextType {
  const contexto = useContext(ShoppingContext);

  if (contexto === undefined) {
    // Este error ayuda a detectar rápidamente si alguien olvidó envolver
    // la aplicación con <ShoppingProvider>.
    throw new Error("useShopping debe usarse dentro de un <ShoppingProvider>");
  }

  return contexto;
}
