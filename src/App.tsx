// =============================================================================
// App.tsx
// -----------------------------------------------------------------------------
// Este es el componente RAÍZ de toda la aplicación. Su trabajo es:
//   1. Envolver todo con el ShoppingProvider, para que CUALQUIER página o
//      componente pueda acceder al carrito de compras.
//   2. Definir las RUTAS de la aplicación: qué página se muestra según la
//      URL actual.
//   3. Mostrar el Header y el Footer en TODAS las páginas (por eso están
//      fuera de <Routes>, y no dentro de cada página individual).
//
// ¿Qué es React Router?
// Es la librería que nos permite tener "varias páginas" en una aplicación
// que, técnicamente, es un solo archivo HTML (ver index.html). Intercepta
// los cambios de URL y decide qué componente mostrar, sin recargar el
// navegador. Esto es lo que hace posible una SPA (Single Page Application).
// =============================================================================

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { Product } from "./pages/Product/Product";
import { About } from "./pages/About/About";
import { ShoppingProvider } from "./context/ShoppingContext";

function App() {
  return (
    // Al envolver toda la app con ShoppingProvider, el Header (que muestra
    // el contador del carrito) y cualquier página futura pueden usar
    // useShopping() sin necesitar que nadie les pase el carrito por props.
    <ShoppingProvider>
      <Header />

      {/* <Routes> examina la URL actual y renderiza SOLO la <Route> cuya
          prop "path" coincide. Es como un "switch" para páginas. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        {/* ":id" es un parámetro dinámico: coincide con /productos/1,
            /productos/2, /productos/cualquier-cosa, etc. Lo leemos dentro
            de Product.tsx usando el hook useParams(). */}
        <Route path="/productos/:id" element={<Product />} />
        <Route path="/nosotros" element={<About />} />
      </Routes>

      <Footer />
    </ShoppingProvider>
  );
}

export default App;
