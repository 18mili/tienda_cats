// src/pages/Registro.jsx
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // tu ruta: src/firebase.js

export default function Registro() {
  const [form, setForm] = useState({ nombre: "", email: "", pass: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.nombre || !form.email || !form.pass) {
      setMsg("Completa todos los campos.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.pass
      );

      // Guardar nombre en el perfil
      await updateProfile(cred.user, { displayName: form.nombre.trim() });

      // Token JWT Firebase (para backend)
      const token = await cred.user.getIdToken(true);

      // Guardar igual que login
      localStorage.setItem("firebase_token", token);
      localStorage.setItem("firebase_uid", cred.user.uid);
      localStorage.setItem("firebase_email", cred.user.email ?? "");
      localStorage.setItem("firebase_name", form.nombre.trim());

      navigate("/"); // o /login si prefieres, pero así queda listo logueado
    } catch (err) {
      console.log("❌ REGISTER ERROR:", err);
      const code = err?.code || "";

      if (code === "auth/email-already-in-use") setMsg("Ese email ya está registrado.");
      else if (code === "auth/invalid-email") setMsg("Email inválido.");
      else if (code === "auth/weak-password") setMsg("Contraseña muy débil (mínimo 6 caracteres).");
      else setMsg("Error al registrar. Revisa Firebase Auth (Email/Password habilitado).");
    }
  };

  return (
    <div className="container-xxl" style={{ maxWidth: 520 }}>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">Crear cuenta</h3>
          {msg && <div className="alert alert-warning py-2">{msg}</div>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="pass"
                value={form.pass}
                onChange={onChange}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Registrarme
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
