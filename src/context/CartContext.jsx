/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'tiendasport_carrito'

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem(STORAGE_KEY)
    return guardado ? JSON.parse(guardado) : []
  })
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [carrito])

  useEffect(() => {
    document.body.classList.toggle('cart-open', carritoAbierto)
    return () => document.body.classList.remove('cart-open')
  }, [carritoAbierto])

  const abrirCarrito = useCallback(() => setCarritoAbierto(true), [])
  const cerrarCarrito = useCallback(() => setCarritoAbierto(false), [])
  const toggleCarrito = useCallback(() => setCarritoAbierto((prev) => !prev), [])

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const agregarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
      )
    )
  }

  const quitarCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item
          const cantidad = (item.cantidad || 1) - 1
          return cantidad <= 0 ? null : { ...item, cantidad }
        })
        .filter(Boolean)
    )
  }

  const vaciarCarrito = () => setCarrito([])

  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * (item.cantidad || 1),
    0
  )

  const cantidadItems = carrito.reduce(
    (sum, item) => sum + (item.cantidad || 1),
    0
  )

  const value = {
    carrito,
    total,
    cantidadItems,
    carritoAbierto,
    abrirCarrito,
    cerrarCarrito,
    toggleCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    agregarCantidad,
    quitarCantidad,
    vaciarCarrito,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
