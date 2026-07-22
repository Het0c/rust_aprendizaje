// =============================================================================
// components/SearchBar/SearchBar.tsx
// -----------------------------------------------------------------------------
// Este componente solamente renderiza un campo de texto de búsqueda.
// No sabe CÓMO se filtran los productos: esa lógica vive en la página
// Products. SearchBar solo avisa "el texto cambió" mediante la prop
// onCambio (una función que le pasa su componente padre).
//
// Esto es un ejemplo de "componente controlado": el valor del <input> no
// vive dentro de SearchBar, sino en el componente padre (Products), y
// SearchBar simplemente MUESTRA ese valor y AVISA cuando cambia. Es la
// forma recomendada de manejar formularios en React.
// =============================================================================

import type { ChangeEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  valor: string;
  onCambio: (nuevoValor: string) => void;
}

export function SearchBar({ valor, onCambio }: SearchBarProps) {
  // Este manejador se ejecuta en CADA tecla que el usuario presiona dentro
  // del input (evento "onChange"). "event.target.value" es el texto actual
  // del campo.
  function manejarCambio(event: ChangeEvent<HTMLInputElement>) {
    onCambio(event.target.value);
  }

  return (
    <div className={styles.contenedorBusqueda}>
      <span aria-hidden="true">🔎</span>
      <input
        type="search"
        placeholder="Buscar producto por nombre..."
        value={valor}
        onChange={manejarCambio}
        className={styles.input}
        aria-label="Buscar producto por nombre"
      />
    </div>
  );
}
