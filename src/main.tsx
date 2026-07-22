// =============================================================================
// main.tsx
// -----------------------------------------------------------------------------
// Este es el PRIMER archivo JavaScript que se ejecuta (index.html lo carga
// directamente). Su única responsabilidad es:
//   1. Encontrar el <div id="root"> definido en index.html.
//   2. "Montar" (dibujar por primera vez) el componente <App /> dentro de
//      ese div, usando ReactDOM.
//   3. Envolver todo con <BrowserRouter> para habilitar React Router.
//
// A partir de aquí, TODA la aplicación vive dentro de componentes de React.
// =============================================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

// createRoot conecta React con el DOM real del navegador (o, en este caso,
// de la ventana de Tauri). El "!" le dice a TypeScript "confía en mí, este
// elemento SÍ existe" (sabemos que existe porque lo definimos en index.html).
ReactDOM.createRoot(document.getElementById("root")!).render(
  // React.StrictMode NO afecta lo que el usuario ve: es una herramienta de
  // desarrollo que ayuda a detectar errores comunes (como efectos
  // secundarios mal escritos) ejecutando ciertas partes del código dos
  // veces SOLO en modo desarrollo, para que notes si algo no es "puro".
  <React.StrictMode>
    {/* BrowserRouter le da a toda la app la capacidad de tener múltiples
        "páginas" basadas en la URL, sin necesitar un servidor real. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
