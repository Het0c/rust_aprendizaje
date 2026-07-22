// =============================================================================
// hooks/useProducts.ts
// -----------------------------------------------------------------------------
// ¿Qué es un "hook personalizado" (custom hook)?
// Es una función que empieza con "use" y que nos permite REUTILIZAR lógica
// que usa otros hooks de React (useState, useEffect, etc.) entre distintos
// componentes, sin repetir código.
//
// ¿Qué problema resuelve useProducts()?
// Cada vez que un componente necesita la lista de productos, tendría que:
//   1. Crear un estado para guardar los productos.
//   2. Crear un estado para saber si está "cargando".
//   3. Crear un estado para guardar errores.
//   4. Llamar al servicio dentro de un useEffect.
// Si la página Home y la página Products necesitan productos, tendríamos
// ese mismo bloque de código duplicado dos veces. Aquí lo escribimos UNA
// sola vez y cualquier componente simplemente hace:
//
//    const { productos, cargando, error } = useProducts();
//
// ¿Cuándo conviene crear un hook personalizado?
// Cuando ves que estás copiando y pegando la MISMA combinación de
// useState + useEffect (u otra lógica) en más de un componente. Si es
// lógica que se usa una sola vez, no vale la pena crear un hook: agrega
// una capa de abstracción innecesaria. La regla práctica es "duplicaste
// la misma lógica dos veces? Es buen momento para extraerla a un hook".
// =============================================================================

import { useState, useEffect } from "react";
import type { Producto } from "../types";
import { getProductos } from "../services/productService";

interface ResultadoUseProducts {
  productos: Producto[];
  cargando: boolean;
  error: string | null;
}

export function useProducts(): ResultadoUseProducts {
  // useState crea una "variable reactiva": cuando cambia su valor,
  // React vuelve a renderizar automáticamente cualquier componente
  // que la esté usando. Es la base de la interactividad en React.
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect ejecuta código DESPUÉS de que el componente se dibuja en
  // pantalla (o cuando cambian ciertos valores, indicados en el arreglo
  // de dependencias al final, "[]" en este caso).
  //
  // El arreglo vacío "[]" significa: "ejecuta este efecto solo UNA vez,
  // apenas el componente aparece por primera vez (montaje)". Es el
  // equivalente a "cuando la página carga, pide los datos".
  useEffect(() => {
    let estaMontado = true; // Bandera para evitar actualizar estado si el
    // componente ya fue removido de la pantalla antes de que la
    // "petición" termine (esto evita advertencias y errores sutiles).

    async function cargarProductos() {
      try {
        setCargando(true);
        const datos = await getProductos();
        if (estaMontado) {
          setProductos(datos);
          setError(null);
        }
      } catch (err) {
        if (estaMontado) {
          setError("No se pudieron cargar los productos.");
        }
      } finally {
        if (estaMontado) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    // La función que retorna useEffect es la "función de limpieza":
    // React la ejecuta cuando el componente desaparece de pantalla.
    return () => {
      estaMontado = false;
    };
  }, []);

  return { productos, cargando, error };
}
