import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { esRutaAdmin } from '../config/routes'
import { useCart } from '../context/CartContext'
import { IMAGES, LOGO_URL } from '../config/assets'

function Login() {
  const { iniciarSesion, cargando } = useAuthContext()
  const { abrirCarrito } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const volverA = location.state?.from || '/'
  const openCartOnReturn = location.state?.openCartOnReturn

  const [formulario, setFormulario] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const validar = () => {
    const nuevosErrores = {}

    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio.'
    } else if (!formulario.email.includes('@')) {
      nuevosErrores.email = 'Ingresá un email válido (debe contener @).'
    }

    if (!formulario.password.trim()) {
      nuevosErrores.password = 'La contraseña es obligatoria.'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarChange = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' })
    }
  }

  const manejarSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    if (cargando) {
      alert('Cargando usuarios, esperá un momento...')
      return
    }

    setEnviando(true)
    const resultado = await iniciarSesion(formulario.email.trim(), formulario.password)
    setEnviando(false)

    if (!resultado.ok) {
      alert(resultado.mensaje)
      return
    }

    if (resultado.usuario.rol === 'admin') {
      if (volverA === '/mis-compras') {
        navigate(volverA)
      } else if (esRutaAdmin(volverA)) {
        navigate(volverA, { state: location.state })
      } else {
        navigate('/dashboard')
      }
      return
    }

    navigate(volverA)
    if (openCartOnReturn) {
      abrirCarrito()
    }
  }

  const manejarVolver = () => {
    navigate(volverA)
  }

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(3, 4, 11, 0.45), rgba(3, 4, 11, 0.25)), url('${IMAGES.portada}')` }}
    >
      <button type="button" className="login-back-btn" onClick={manejarVolver}>
        ← Volver
      </button>

      <div className="login-card card p-4 p-md-5">
        <Link to="/" className="login-logo-link">
          <img src={LOGO_URL} alt="TiendaSport" className="login-logo" />
        </Link>
        <p className="login-eyebrow">Tu tienda deportiva</p>
        <h1 className="login-title mb-4">Iniciar sesión</h1>
        <form onSubmit={manejarSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              value={formulario.email}
              onChange={manejarChange}
              placeholder="tu@email.com"
              autoComplete="username"
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="login-password-wrap">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                value={formulario.password}
                onChange={manejarChange}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setMostrarPassword((visible) => !visible)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M1 1l22 22" />
                    <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errores.password && <div className="invalid-feedback d-block">{errores.password}</div>}
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary hover-btn" disabled={enviando || cargando}>
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
            <button type="button" className="btn login-volver-btn rounded-pill" onClick={manejarVolver}>
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
