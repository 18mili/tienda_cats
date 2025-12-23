import { useState } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../services/api";

export default function Carrito() {
  const { state, add, decrement, remove, clear } = useCart();
  const items = Object.values(state.items);
  const total = items.reduce((acc, it) => acc + it.precio * it.qty, 0);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <>
        <h2>Tu carrito está vacío</h2>
        <p>Ve al catálogo y agrega productos.</p>
      </>
    );
  }

  const onComprar = async () => {
    setMsg("");

    const token = localStorage.getItem("firebase_token");
    if (!token) {
      setMsg("Debes iniciar sesión para comprar (no hay token).");
      return;
    }

    // Payload para backend (simple y claro)
    // ✅ Esto asume que tu backend recibirá:
    // - items: [{ productId, name, price, qty }]
    // - total
    const payload = {
      items: items.map((it) => ({
        productId: it.id,
        name: it.nombre,
        price: it.precio,
        qty: it.qty,
      })),
      total,
    };

    try {
      setLoading(true);
      const created = await createOrder(payload);

      clear();
      setMsg(`✅ Compra registrada en backend. ID: ${created?.id ?? "OK"}`);
    } catch (e) {
      setMsg(e?.message || "Error al registrar compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-3">Carrito</h2>

      {msg && <Alert variant={msg.startsWith("✅") ? "success" : "warning"}>{msg}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th style={{ width: 180 }}>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.nombre}</td>
              <td>${it.precio.toLocaleString()}</td>
              <td>
                <div className="d-flex gap-2 align-items-center">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => decrement(it.id)}
                    disabled={loading}
                  >
                    -
                  </Button>
                  <span>{it.qty}</span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => add(it)}
                    disabled={loading}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>${(it.precio * it.qty).toLocaleString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => remove(it.id)}
                  disabled={loading}
                >
                  Quitar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <h4>Total: ${total.toLocaleString()}</h4>

        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={clear} disabled={loading}>
            Vaciar carrito
          </Button>

          <Button variant="primary" onClick={onComprar} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" /> Procesando...
              </>
            ) : (
              "Comprar"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
