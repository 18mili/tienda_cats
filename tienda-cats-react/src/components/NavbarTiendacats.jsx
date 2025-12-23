import { useEffect, useState } from "react"
import { Navbar, Nav, Container, Badge } from "react-bootstrap"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext.jsx"
import { FaShoppingCart } from "react-icons/fa"

export default function NavbarTiendacats() {
  const { count } = useCart()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const loadUser = () => {
    // ✅ 1) modo demo (tu panel actual)
    const demoRaw = localStorage.getItem("auth_demo")
    if (demoRaw) {
      try {
        return JSON.parse(demoRaw)
      } catch {
        return null
      }
    }

    // ✅ 2) modo firebase (login real)
    const email = localStorage.getItem("firebase_email")
    if (email) {
      return { email, isAdmin: email === "admin@tiendacats.com" } // admin simple por email (rápido)
    }

    return null
  }

  useEffect(() => {
    setUser(loadUser())
  }, [location])

  useEffect(() => {
    const onStorage = (e) => {
      if (["auth_demo", "firebase_email"].includes(e.key)) {
        setUser(loadUser())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const logout = () => {
    // limpia demo
    localStorage.removeItem("auth_demo")

    // limpia firebase
    localStorage.removeItem("firebase_token")
    localStorage.removeItem("firebase_uid")
    localStorage.removeItem("firebase_email")

    setUser(null)
    navigate("/")
  }

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="md" className="mb-0">
      <Container className="container-xxl">
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
          <img
            src="/assets/logo.jpg"
            alt="TiendaCats logo"
            height="28"
            style={{ borderRadius: "50%" }}
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
          <span>TiendaCats</span>
        </Navbar.Brand>

        {/* Saludo junto al logo */}
        {user && (
          <div className="d-flex align-items-center ms-2 d-none d-md-flex">
            <small className="text-light">
              Hola, {(user.email || "").split("@")[0]}
            </small>

            {user.isAdmin && (
              <Nav.Link as={NavLink} to="/admin" className="p-0 ms-3 text-light small">
                Admin
              </Nav.Link>
            )}
          </div>
        )}

        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>

            {user ? (
              <Nav.Link onClick={logout}>Cerrar sesión</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registro</Nav.Link>
              </>
            )}

            <Nav.Link as={NavLink} to="/carrito">
              <FaShoppingCart style={{ marginRight: 6 }} />
              Carrito {count > 0 && <Badge bg="secondary">{count}</Badge>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
