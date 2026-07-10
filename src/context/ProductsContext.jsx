/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { imagenProducto } from '../config/assets'

const ProductsContext = createContext(null)
const STORAGE_KEY = 'tiendasport_productos_v4'

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch('/productos.json')
        if (!respuesta.ok) throw new Error('No se pudieron cargar los productos')
        const dataJson = await respuesta.json()

        const guardados = localStorage.getItem(STORAGE_KEY)
        if (guardados) {
          const dataLocal = JSON.parse(guardados)
          const normalizados = dataLocal.map((producto) => {
            const base = dataJson.find((p) => p.id === producto.id)
            const avatarInvalido = !producto.avatar || producto.avatar.includes('logo.png')
            return {
              ...producto,
              avatar: avatarInvalido
                ? imagenProducto(base?.avatar)
                : imagenProducto(producto.avatar),
            }
          })
          setProductos(normalizados)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados))
        } else {
          const data = dataJson.map((p) => ({ ...p, avatar: imagenProducto(p.avatar) }))
          setProductos(data)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
      } catch (err) {
        console.error(err)
        setError('Hubo un problema al cargar los productos.')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  const persistir = (lista) => {
    setProductos(lista)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  const validarProducto = (producto) => {
    const errores = {}

    if (!producto.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio.'
    }

    const precio = Number(producto.precio)
    if (!producto.precio && producto.precio !== 0) {
      errores.precio = 'El precio es obligatorio.'
    } else if (isNaN(precio) || precio <= 0) {
      errores.precio = 'Debe ser un número mayor a 0.'
    }

    if (!producto.descripcion?.trim()) {
      errores.descripcion = 'La descripción es obligatoria.'
    } else if (producto.descripcion.trim().length < 10) {
      errores.descripcion = 'Mínimo 10 caracteres.'
    }

    if (!producto.categoriaId) {
      errores.categoriaId = 'Seleccioná una categoría.'
    }

    return errores
  }

  const agregarProducto = (nuevo) => {
    const errores = validarProducto(nuevo)
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores }
    }

    const id = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1
    const producto = {
      ...nuevo,
      id,
      nombre: nuevo.nombre.trim(),
      descripcion: nuevo.descripcion.trim(),
      precio: Number(nuevo.precio),
      categoriaId: Number(nuevo.categoriaId),
      avatar: imagenProducto(nuevo.avatar),
    }
    persistir([...productos, producto])
    return { ok: true, producto }
  }

  const editarProducto = (actualizado) => {
    const errores = validarProducto(actualizado)
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores }
    }

    const lista = productos.map((p) =>
      p.id === actualizado.id
        ? {
            ...actualizado,
            nombre: actualizado.nombre.trim(),
            descripcion: actualizado.descripcion.trim(),
            precio: Number(actualizado.precio),
            categoriaId: Number(actualizado.categoriaId),
            avatar: imagenProducto(actualizado.avatar),
          }
        : p
    )
    persistir(lista)
    return { ok: true }
  }

  const eliminarProducto = (id) => {
    persistir(productos.filter((p) => p.id !== id))
    return { ok: true }
  }

  const obtenerPorId = (id) => productos.find((p) => p.id === Number(id))

  const value = {
    productos,
    cargando,
    error,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    validarProducto,
    obtenerPorId,
  }

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductsProvider')
  }
  return context
}
