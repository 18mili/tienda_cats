import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductos } from "../services/api";
import ProductsGrid from "../components/ProductsGrid";
import { useCart } from "../context/CartContext.jsx";

function mapBackendToUi(p) {
  if (!p) return null;

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

  return p;
}

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    const load = async () => {
      const lista = await getProductos();
      const mapped = (lista || []).map(mapBackendToUi).filter(Boolean);
      setDestacados(mapped.filter((p) => p.destacado));
    };

    load();
    window.addEventListener("productos_updated", load);
    return () => window.removeEventListener("productos_updated", load);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container-xxl">
          <Row className="align-items-center">
            <Col lg={7} className="mb-3">
              <h1 className="display-4 fw-bold mb-2">Tienda de Gatitos</h1>
              <p className="lead mb-4">Todo lo que tu felino necesita.</p>
              <Button as={Link} to="/catalogo" variant="primary" size="lg">
                Ver catálogo
              </Button>
            </Col>
            <Col lg={5} className="text-center">
              <img
                className="img-fluid rounded"
                src="/assets/rascador.jpg"
                alt="Gato"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </Col>
          </Row>
        </div>
      </section>

      <div className="container-xxl">
        <h2 className="section-title">Productos destacados</h2>
        <ProductsGrid productos={destacados} onAgregar={add} />
      </div>
    </>
  );
}
