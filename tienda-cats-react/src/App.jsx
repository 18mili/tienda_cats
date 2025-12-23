import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";

import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import PostDetalle from "./pages/PostDetalle";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Detalle />} />
        <Route path="/carrito" element={<Carrito />} />

        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<PostDetalle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Panel admin real (Productos + Compras) */}
        <Route path="/admin" element={<Admin />} />

        {/* Opcional: ruta 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
