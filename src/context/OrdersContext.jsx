/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const OrdersContext = createContext(null)
const STORAGE_KEY = 'tiendasport_compras'

export function OrdersProvider({ children }) {
  const [compras, setCompras] = useState(() => {
    const guardadas = localStorage.getItem(STORAGE_KEY)
    return guardadas ? JSON.parse(guardadas) : []
  })

  const persistir = (lista) => {
    setCompras(lista)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  const registrarCompra = (usuario, items, total) => {
    const id = compras.length ? Math.max(...compras.map((c) => c.id)) + 1 : 1
    const compra = {
      id,
      userId: usuario.id,
      userEmail: usuario.email,
      userNombre: usuario.nombre,
      items: items.map(({ id, nombre, precio, cantidad, avatar }) => ({
        id,
        nombre,
        precio,
        cantidad: cantidad || 1,
        avatar,
      })),
      total,
      fecha: new Date().toISOString(),
    }
    persistir([compra, ...compras])
    return compra
  }

  const obtenerComprasUsuario = (userId) =>
    compras.filter((c) => c.userId === userId)

  const value = {
    compras,
    registrarCompra,
    obtenerComprasUsuario,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider')
  }
  return context
}
