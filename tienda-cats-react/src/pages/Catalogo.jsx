import { useEffect, useMemo, useState } from "react";
import Filters from "../components/Filters";
import ProductsGrid from "../components/ProductsGrid";
import { getProductos } from "../services/api";
import { useCart } from "../context/CartContext.jsx";

function mapBackendToUi(p) {
  if (!p) return null;

  // backend -> UI
  if (p.name !== undefined || p.imageUrl !== undefined) {
    return {
      id: p.id,
      nombre: p.name ?? "",
      precio: Number(p.price ?? 0),
      imagen: p.imageUrl ?? "",
      categoria: p.category ?? "",
      destacado: Boolean(p.featured),
      stock: p.stock ?? null,
    };
  }

  // demo -> ya viene como UI
  return p;
}

export default function Catalogo() {
  const [lista, setLista] = useState([]);
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const { add } = useCart();

  useEffect(() => {
    const load = async () => {
      const productos = await getProductos();
      setLista((productos || []).map(mapBackendToUi).filter(Boolean));
    };

    load();
    window.addEventListener("productos_updated", load);
    return () => window.removeEventListener("productos_updated", load);
  }, []);

  const filtrados = useMemo(() => {
    const qlow = q.toLowerCase();
    return lista.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (p.nombre || "").toLowerCase().includes(qlow)
    );
  }, [lista, q, categoria]);

  return (
    <>
      <Filters q={q} setQ={setQ} categoria={categoria} setCategoria={setCategoria} />
      <ProductsGrid productos={filtrados} onAgregar={add} />
    </>
  );
}
