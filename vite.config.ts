// =============================================================================
// vite.config.ts
// -----------------------------------------------------------------------------
// ¿Qué es Vite?
// Vite es la herramienta que convierte nuestro código React + TypeScript
// (que los navegadores NO entienden directamente) en archivos JavaScript,
// HTML y CSS normales que sí pueden ejecutarse.
//
// ¿Por qué existe este archivo?
// Tauri necesita saber en qué puerto corre Vite y en qué carpeta debe buscar
// los archivos finales para empaquetarlos dentro de la aplicación de
// escritorio. Este archivo configura exactamente eso.
// =============================================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // El plugin de React le enseña a Vite a entender archivos .tsx (JSX + TS).
  plugins: [react()],

  // ---------------------------------------------------------------------
  // Configuración específica para que Vite conviva bien con Tauri.
  // Tauri levanta una ventana nativa que "apunta" a este servidor mientras
  // desarrollamos (npm run tauri dev), por eso el puerto debe ser fijo.
  // ---------------------------------------------------------------------
  clearScreen: false, // Para que los logs de Rust no se borren con los de Vite.
  server: {
    port: 1420, // Puerto fijo esperado por Tauri (ver src-tauri/tauri.conf.json).
    strictPort: true, // Si el puerto está ocupado, falla en vez de cambiarlo.
    watch: {
      // Evita que Vite reinicie por cambios dentro de la carpeta de Rust.
      ignored: ["**/src-tauri/**"],
    },
  },
}));
