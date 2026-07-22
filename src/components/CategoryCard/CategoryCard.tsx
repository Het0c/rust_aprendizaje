// =============================================================================
// components/CategoryCard/CategoryCard.tsx
// -----------------------------------------------------------------------------
// Este componente solamente renderiza una tarjeta de categoría (ej: "Jeans").
// No conoce cómo se obtienen las categorías. Solo recibe información
// mediante props, igual que ProductCard.
//
// Al hacer clic, navega a la página de Productos con un filtro de categoría
// aplicado usando un "query param" en la URL (ej: /productos?categoria=jeans).
// Esto permite que la página de Productos sepa qué categoría mostrar con
// solo leer la URL, sin que tengamos que usar Context para algo tan puntual.
// =============================================================================

import { Link } from "react-router-dom";
import type { Categoria } from "../../types";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  categoria: Categoria;
}

export function CategoryCard({ categoria }: CategoryCardProps) {
  return (
    <Link
      to={`/productos?categoria=${categoria.id}`}
      className={styles.tarjeta}
    >
      <span className={styles.icono} aria-hidden="true">
        {categoria.icono}
      </span>
      <span className={styles.nombre}>{categoria.nombre}</span>
    </Link>
  );
}
