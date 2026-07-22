// =============================================================================
// main.rs — Punto de arranque del ejecutable
// -----------------------------------------------------------------------------
// Este archivo es intencionalmente muy corto. Su único trabajo es llamar a
// la función run() que definimos en lib.rs.
//
// ¿Por qué separar main.rs de lib.rs si podríamos poner todo aquí?
// Es una convención común en proyectos Rust/Tauri: mantener main.rs mínimo
// permite que la lógica (lib.rs) se pueda reutilizar o testear más fácil,
// y además es requisito para poder compilar la app también para móviles.
//
// La primera línea (el atributo) evita que en Windows se abra además una
// consola de texto negra detrás de la ventana de la app.
// =============================================================================
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tienda_moda_local_lib::run();
}
