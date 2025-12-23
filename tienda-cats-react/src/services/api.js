// src/services/api.js
const API_URL = "http://localhost:8080/api/v1";

// ============================
// UTIL: headers con JWT (Firebase Token)
// ============================
function authHeaders() {
  const token = localStorage.getItem("firebase_token");

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers["Content-Type"] = "application/json";
  return headers;
}

// helper: validar token
function requireToken() {
  const token = localStorage.getItem("firebase_token");
  if (!token) throw new Error("No autenticado (401). No hay token en localStorage.");
  return token;
}

// ============================
// PRODUCTOS
// ============================
export async function getProductos() {
  const resp = await fetch(`${API_URL}/products`, { headers: authHeaders() });
  if (!resp.ok) throw new Error("Error al obtener productos");

  const data = await resp.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}

export async function getProductoById(id) {
  const resp = await fetch(`${API_URL}/products/${id}`, { headers: authHeaders() });

  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error("Error al obtener producto");
  return await resp.json();
}

export async function createProducto(data) {
  requireToken();

  const resp = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (ADMIN) (403).");
  if (!resp.ok) throw new Error("Error al crear producto");

  return await resp.json();
}

export async function updateProducto(id, data) {
  requireToken();

  const resp = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (ADMIN) (403).");
  if (!resp.ok) throw new Error("Error al actualizar producto");

  return await resp.json();
}

export async function deleteProducto(id) {
  requireToken();

  const resp = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (ADMIN) (403).");
  if (!resp.ok) throw new Error("Error al eliminar producto");

  return true;
}

// ============================
// ADMIN USERS (solo ADMIN)
// ============================
export async function getAdminUsers() {
  requireToken(); // evita Bearer null

  const resp = await fetch(`${API_URL}/admin/users`, {
    headers: authHeaders(),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (403). Debes ser ADMIN.");
  if (!resp.ok) throw new Error("Error al obtener usuarios");

  const data = await resp.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}

// ============================
// ORDERS / COMPRAS
// ============================
export async function createOrder(orderPayload) {
  requireToken();

  const resp = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(orderPayload),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (403).");
  if (!resp.ok) throw new Error("Error al crear la compra");

  return await resp.json();
}

export async function getOrders() {
  requireToken();

  const resp = await fetch(`${API_URL}/orders`, {
    headers: authHeaders(),
  });

  if (resp.status === 401) throw new Error("No autenticado (401).");
  if (resp.status === 403) throw new Error("No autorizado (ADMIN) (403).");
  if (!resp.ok) throw new Error("Error al obtener compras");

  const data = await resp.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}

// ============================
// POSTS (JSON local)
// ============================
export async function getPosts() {
  const resp = await fetch("/data/posts.json");
  return await resp.json();
}
