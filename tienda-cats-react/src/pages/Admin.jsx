import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  getProductos,
  createProducto,
  deleteProducto,
  getOrders,
  getAdminUsers,
} from "../services/api";

export default function Admin() {
  // =========================
  // STATE
  // =========================
  const [productos, setProductos] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [msg, setMsg] = useState("");
  const [errProd, setErrProd] = useState("");
  const [errOrders, setErrOrders] = useState("");
  const [errUsers, setErrUsers] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    category: "",
    featured: false,
    stock: "",
  });

  const navigate = useNavigate();

  const email = localStorage.getItem("firebase_email") || "";
  const token = localStorage.getItem("firebase_token");

  // ⚠️ Validación SOLO UI
  const esAdminUI = email === "admin@tiendacats.com";

  // =========================
  // LOADERS
  // =========================
  const cargarProductos = async () => {
    setErrProd("");
    try {
      const data = await getProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch {
      setErrProd("⚠️ No se pudieron cargar productos.");
    }
  };

  const cargarOrders = async () => {
    setErrOrders("");
    try {
      setLoadingOrders(true);
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      const m = String(e?.message || "");
      if (m.includes("403")) setErrOrders("⚠️ No autorizado para ver compras (403).");
      else if (m.includes("401")) setErrOrders("⚠️ No autenticado (401).");
      else setErrOrders("⚠️ Error cargando compras.");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const cargarUsuarios = async () => {
    setErrUsers("");
    try {
      setLoadingUsers(true);
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      const m = String(e?.message || "");
      if (m.includes("403")) setErrUsers("⚠️ No autorizado para ver usuarios (403).");
      else if (m.includes("401")) setErrUsers("⚠️ No autenticado (401).");
      else setErrUsers("⚠️ Error cargando usuarios.");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!esAdminUI) {
      navigate("/");
      return;
    }

    cargarProductos();
    cargarOrders();
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // HANDLERS
  // =========================
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrProd("");
    setLoading(true);

    try {
      await createProducto({
        name: form.name,
        price: Number(form.price) || 0,
        imageUrl: form.imageUrl,
        category: form.category,
        featured: Boolean(form.featured),
        stock: Number(form.stock) || 0,
      });

      setForm({
        name: "",
        price: "",
        imageUrl: "",
        category: "",
        featured: false,
        stock: "",
      });

      await cargarProductos();
      setMsg("✅ Producto creado.");
    } catch {
      setErrProd("❌ No se pudo crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    setErrProd("");
    setLoading(true);
    try {
      await deleteProducto(id);
      await cargarProductos();
      setMsg("✅ Producto eliminado.");
    } catch {
      setErrProd("❌ No se pudo eliminar.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <Container className="container-xxl">
      <h2 className="mb-2">Panel de Administración</h2>
      <div className="text-muted mb-3">Sesión: {email}</div>

      {msg && <Alert variant="success">{msg}</Alert>}
      {errProd && <Alert variant="warning">{errProd}</Alert>}
      {errOrders && <Alert variant="warning">{errOrders}</Alert>}
      {errUsers && <Alert variant="warning">{errUsers}</Alert>}

      {/* ===================== PRODUCTOS ===================== */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="p-3">
            <h5>Agregar producto</h5>
            <Form onSubmit={addProduct}>
              <Form.Control className="mb-2" placeholder="Nombre" name="name" value={form.name} onChange={onChange} required />
              <Form.Control className="mb-2" placeholder="Precio" type="number" name="price" value={form.price} onChange={onChange} />
              <Form.Control className="mb-2" placeholder="Imagen URL" name="imageUrl" value={form.imageUrl} onChange={onChange} />
              <Form.Select className="mb-2" name="category" value={form.category} onChange={onChange}>
                <option value="">Categoría</option>
                <option value="alimento">Alimento</option>
                <option value="juguete">Juguete</option>
                <option value="accesorio">Accesorio</option>
              </Form.Select>
              <Form.Control className="mb-2" placeholder="Stock" type="number" name="stock" value={form.stock} onChange={onChange} />
              <Form.Check className="mb-3" label="Destacado" name="featured" checked={form.featured} onChange={onChange} />
              <Button type="submit" disabled={loading}>Agregar</Button>
            </Form>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-3">
            <h5>Productos</h5>
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th>ID</th><th>Nombre</th><th>Precio</th><th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => eliminarProducto(p.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* ===================== USUARIOS ===================== */}
      <Row className="mt-4">
        <Col>
          <Card className="p-3">
            <h5>Usuarios registrados (Firebase)</h5>

            {loadingUsers ? (
              <p>Cargando usuarios...</p>
            ) : (
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>UID</th>
                    <th>Rol</th>
                    <th>Verificado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.uid}>
                      <td>{u.email}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{u.uid}</td>
                      <td>{u.role || "USER"}</td>
                      <td>{u.emailVerified ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>

      {/* ===================== COMPRAS ===================== */}
      <Row className="mt-4">
        <Col>
          <Card className="p-3">
            <h5>Compras</h5>
            {loadingOrders ? (
              <p>Cargando compras...</p>
            ) : (
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.userEmail}</td>
                      <td>${o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
