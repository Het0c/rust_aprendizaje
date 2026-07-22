// =============================================================================
// lib.rs — El "cerebro" en Rust de nuestra aplicación
// -----------------------------------------------------------------------------
// Aquí vive la lógica que corre en Rust (NO en el navegador/React).
//
// ¿Qué es un "comando" de Tauri?
// Es una función escrita en Rust que React puede "llamar" como si fuera una
// función normal de JavaScript, usando la utilidad `invoke`. Esto es el
// puente (bridge) entre el mundo de React y el mundo de Rust.
//
// ¿Por qué querríamos hacer esto en vez de todo en JavaScript?
// Porque Rust puede acceder a cosas que el navegador NO puede: el sistema
// de archivos, la red a bajo nivel, procesos del sistema operativo, mayor
// rendimiento para cálculos pesados, etc. En este proyecto de ejemplo el
// comando es muy simple (un saludo), pero la idea es que veas EL MECANISMO,
// no la complejidad.
// =============================================================================

// El atributo #[tauri::command] convierte una función Rust normal en algo
// que React puede invocar remotamente.
//
// Recibe un parámetro `nombre` (String) y devuelve un String con el saludo.
// Fíjate que el nombre del parámetro en Rust (nombre) debe coincidir con el
// nombre que usemos desde React al invocar el comando.
#[tauri::command]
fn saludar(nombre: &str) -> String {
    // format! es como un "template string" en Rust: arma un String combinando
    // texto fijo con variables.
    format!(
        "¡Hola, {}! Bienvenido/a a Moda Local, tu tienda de barrio. (Este saludo fue generado en Rust 🦀)",
        nombre
    )
}

// Esta función es el punto de entrada de la parte Rust de la aplicación.
// Tauri la llama automáticamente al iniciar.
//
// #[cfg_attr(mobile, tauri::mobile_entry_point)] permite que este mismo
// código funcione también si algún día compilamos para celular (iOS/Android),
// algo que Tauri 2.x soporta.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // ---------------------------------------------------------------
        // invoke_handler le dice a Tauri: "estos son los comandos que
        // React tiene permitido llamar". Si no registras un comando aquí,
        // React NO podrá usarlo aunque la función exista.
        // ---------------------------------------------------------------
        .invoke_handler(tauri::generate_handler![saludar])
        .run(tauri::generate_context!())
        .expect("Error al iniciar la aplicación Tauri");
}
