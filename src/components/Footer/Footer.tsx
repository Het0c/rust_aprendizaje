// =============================================================================
// components/Footer/Footer.tsx
// -----------------------------------------------------------------------------
// Este componente solamente renderiza el pie de página.
// No conoce cómo se obtienen los datos. Toda la información (dirección,
// horario, teléfono, redes) está escrita directamente aquí porque son
// datos institucionales de la tienda que casi nunca cambian, a diferencia
// de los productos. Si cambiaran seguido, también los moveríamos a un
// archivo JSON o a un servicio, igual que hicimos con los productos.
// =============================================================================

import styles from "./Footer.module.css";

export function Footer() {
  // new Date().getFullYear() obtiene el año actual del sistema, así el
  // "© 2026" del footer nunca queda desactualizado manualmente.
  const anioActual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <hr className="linea-costura" />
      <div className={`contenedor ${styles.contenido}`}>
        <div className={styles.columna}>
          <h3 className={styles.titulo}>Moda Local</h3>
          <p>📍 Av. Los Aromos 482, esquina con Pje. Las Rosas</p>
          <p>🕒 Lunes a sábado, 10:00 – 20:00 hrs</p>
          <p>📞 +56 9 1234 5678</p>
        </div>

        <div className={styles.columna}>
          <h3 className={styles.titulo}>Síguenos</h3>
          <ul className={styles.redes}>
            <li>📸 Instagram: @modalocal.barrio</li>
            <li>📘 Facebook: Moda Local</li>
            <li>🐦 X (Twitter): @modalocalcl</li>
          </ul>
        </div>

        <div className={styles.columna}>
          <h3 className={styles.titulo}>Sobre esta app</h3>
          <p>
            Aplicación de ejemplo construida con Tauri 2, React, TypeScript y
            Vite, con fines 100% educativos.
          </p>
        </div>
      </div>

      <p className={styles.derechos}>
        © {anioActual} Moda Local — Proyecto de aprendizaje, no es un negocio real.
      </p>
    </footer>
  );
}
