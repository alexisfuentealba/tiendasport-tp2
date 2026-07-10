/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'tiendasport_usuario'

async function obtenerUsuarios() {
  const respuesta = await fetch('/users.json')
  if (!respuesta.ok) throw new Error('No se pudieron cargar los usuarios')
  return respuesta.json()
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerUsuarios()
        setUsuarios(data)
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
      }

      const guardado = localStorage.getItem(STORAGE_KEY)
      if (guardado) {
        setUsuario(JSON.parse(guardado))
      }
      setCargando(false)
    }

    cargarDatos()
  }, [])

  const iniciarSesion = async (email, password) => {
    let lista = usuarios

    if (lista.length === 0) {
      try {
        lista = await obtenerUsuarios()
        setUsuarios(lista)
      } catch {
        return { ok: false, mensaje: 'Error al cargar usuarios. Intentá de nuevo.' }
      }
    }

    const emailLimpio = email.trim().toLowerCase()
    const encontrado = lista.find(
      (u) => u.email.toLowerCase() === emailLimpio && u.password === password
    )

    if (!encontrado) {
      return { ok: false, mensaje: 'Email o contraseña incorrectos.' }
    }

    const sesion = {
      id: encontrado.id,
      email: encontrado.email,
      nombre: encontrado.nombre,
      rol: encontrado.rol,
    }

    setUsuario(sesion)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion))
    return { ok: true, usuario: sesion }
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    isAuthenticated: !!usuario,
    esAdmin: usuario?.rol === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider')
  }
  return context
}
