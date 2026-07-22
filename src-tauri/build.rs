// =============================================================================
// build.rs
// -----------------------------------------------------------------------------
// Este archivo NO es parte de la app en sí. Es un "script de construcción":
// Rust lo ejecuta automáticamente ANTES de compilar el proyecto.
//
// tauri_build::build() se encarga de tareas internas de Tauri, como generar
// código para los íconos, permisos y metadata de la aplicación.
//
// Como estudiante, no necesitas tocar este archivo casi nunca.
// =============================================================================

fn main() {
    tauri_build::build()
}
