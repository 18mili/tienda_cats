// src/pages/Login.jsx
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // ✅ si tu archivo es: src/firebase.js

export default function Login() {
  const [form, setForm] = useState({ email: "", pass: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.email || !form.pass) {
      setMsg("Completa email y contraseña.");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, form.email.trim(), form.pass);

      // ✅ token fresco
      const token = await cred.user.getIdToken(true);

      // ✅ guarda como lo usa ticketsApi.js
      localStorage.setItem("firebase_token", token);
      localStorage.setItem("firebase_uid", cred.user.uid);
      localStorage.setItem("firebase_email", cred.user.email ?? "");

      console.log("✅ LOGIN OK - TOKEN:", token);

      navigate("/"); // si quieres ir al admin: navigate("/admin")
    } catch (err) {
      console.log("❌ LOGIN ERROR:", err);

      // Mensajes típicos de Firebase
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setMsg("Contraseña incorrecta.");
      } else if (code === "auth/user-not-found") {
        setMsg("Usuario no existe. Regístrate primero.");
      } else if (code === "auth/invalid-email") {
        setMsg("Email inválido.");
      } else {
        setMsg("Error al iniciar sesión. Revisa Firebase Auth (Email/Password habilitado).");
      }
    }
  };

  return (
    <div className="container-xxl" style={{ maxWidth: 480 }}>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">Iniciar sesión</h3>
          {msg && <div className="alert alert-warning py-2">{msg}</div>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="pass"
                value={form.pass}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Entrar
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
