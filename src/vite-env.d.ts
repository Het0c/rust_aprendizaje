/// <reference types="vite/client" />
// Esta línea le "presta" a TypeScript las definiciones de tipos que Vite
// ya trae incluidas: por ejemplo, le enseña que se puede hacer
// `import styles from "./Componente.module.css"` y que el resultado es
// un objeto donde cada clase CSS es una propiedad de tipo string.
// Sin este archivo, TypeScript marcaría error en cada import de un
// archivo .module.css.
