/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { imagenCategoria } from '../config/assets'

const CategoriesContext = createContext(null)
const STORAGE_KEY = 'tiendasport_categorias_v6'

export function CategoriesProvider({ children }) {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const respuesta = await fetch('/categorias.json')
        if (!respuesta.ok) throw new Error('No se pudieron cargar las categorías')
        const dataJson = await respuesta.json()

        const guardadas = localStorage.getItem(STORAGE_KEY)
        if (guardadas) {
          const dataLocal = JSON.parse(guardadas)
          const normalizados = dataLocal.map((categoria) => {
            const base = dataJson.find((c) => c.id === categoria.id)
            return {
              ...categoria,
              avatar: imagenCategoria(categoria.avatar || base?.avatar),
            }
          })
          setCategorias(normalizados)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados))
        } else {
          const data = dataJson.map((c) => ({ ...c, avatar: imagenCategoria(c.avatar) }))
          setCategorias(data)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
      } catch (err) {
        console.error(err)
        setError('Hubo un problema al cargar las categorías.')
      } finally {
        setCargando(false)
      }
    }

    cargarCategorias()
  }, [])

  const persistir = (lista) => {
    setCategorias(lista)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  const validarCategoria = (categoria) => {
    const errores = {}
    if (!categoria.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio.'
    } else if (categoria.nombre.trim().length < 3) {
      errores.nombre = 'Mínimo 3 caracteres.'
    }
    if (!categoria.descripcion?.trim()) {
      errores.descripcion = 'La descripción es obligatoria.'
    } else if (categoria.descripcion.trim().length < 5) {
      errores.descripcion = 'Mínimo 5 caracteres.'
    }
    return errores
  }

  const agregarCategoria = (nueva) => {
    const errores = validarCategoria(nueva)
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores }
    }

    const id = categorias.length
      ? Math.max(...categorias.map((c) => c.id)) + 1
      : 1
    const categoria = {
      ...nueva,
      id,
      nombre: nueva.nombre.trim(),
      descripcion: nueva.descripcion.trim(),
      avatar: imagenCategoria(nueva.avatar),
    }
    persistir([...categorias, categoria])
    return { ok: true, categoria }
  }

  const editarCategoria = (actualizada) => {
    const errores = validarCategoria(actualizada)
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores }
    }

    const lista = categorias.map((c) =>
      c.id === actualizada.id
        ? {
            ...actualizada,
            nombre: actualizada.nombre.trim(),
            descripcion: actualizada.descripcion.trim(),
            avatar: imagenCategoria(actualizada.avatar),
          }
        : c
    )
    persistir(lista)
    return { ok: true }
  }

  const eliminarCategoria = (id) => {
    persistir(categorias.filter((c) => c.id !== id))
    return { ok: true }
  }

  const obtenerPorId = (id) => categorias.find((c) => c.id === Number(id))

  const value = {
    categorias,
    cargando,
    error,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    validarCategoria,
    obtenerPorId,
  }

  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories debe usarse dentro de CategoriesProvider')
  }
  return context
}
