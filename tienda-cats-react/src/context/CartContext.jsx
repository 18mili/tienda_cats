import { createContext, useContext, useEffect, useReducer } from "react"

const CartContext = createContext()

const initial = { items: {} } // { [id]: {id,nombre,precio,imagen,qty} }

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload ?? initial

    case "ADD": {
      const it = action.item
      if (!it || it.id == null) return state

      const key = String(it.id)
      const prev = state.items[key] || { ...it, qty: 0, id: it.id }

      const items = {
        ...state.items,
        [key]: { ...prev, qty: prev.qty + 1 },
      }
      return { ...state, items }
    }

    case "DECREMENT": {
      const key = String(action.id)
      const it = state.items[key]
      if (!it) return state

      const qty = it.qty - 1
      const items = { ...state.items }

      if (qty <= 0) delete items[key]
      else items[key] = { ...it, qty }

      return { ...state, items }
    }

    case "REMOVE": {
      const key = String(action.id)
      const items = { ...state.items }
      delete items[key]
      return { ...state, items }
    }

    case "CLEAR":
      return initial

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  // cargar desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem("cart")
    if (!raw) return
    try {
      dispatch({ type: "SET", payload: JSON.parse(raw) })
    } catch {
      // si está corrupto, lo reseteamos
      localStorage.removeItem("cart")
    }
  }, [])

  // guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  const add = (item) => dispatch({ type: "ADD", item })
  const decrement = (id) => dispatch({ type: "DECREMENT", id })
  const remove = (id) => dispatch({ type: "REMOVE", id })
  const clear = () => dispatch({ type: "CLEAR" })

  const count = Object.values(state.items).reduce((a, it) => a + (it.qty || 0), 0)

  return (
    <CartContext.Provider value={{ state, add, decrement, remove, clear, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
