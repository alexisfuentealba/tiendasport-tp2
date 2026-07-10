import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { LOGO_URL } from '../../config/assets'
import { IconoUsuario, IconoSalir, IconoCarrito } from './NavIcons'
import './Navbar.css'

function Navbar() {
  const { usuario, isAuthenticated, esAdmin, cerrarSesion } = useAuthContext()
  const { cantidadItems, abrirCarrito } = useCart()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()

  const cerrarMenu = () => setMenuAbierto(false)

  const irAlInicio = (event) => {
    cerrarMenu()
    if (location.pathname === '/' && !location.hash) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const manejarCarrito = () => {
    abrirCarrito()
    cerrarMenu()
  }

  const inicialUsuario = usuario?.nombre?.charAt(0)?.toUpperCase() || '?'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-brand-link"
          onClick={irAlInicio}
          aria-label="Ir al inicio - TiendaSport"
          title="Ir al inicio"
        >
          <img src={LOGO_URL} alt="TiendaSport" className="navbar-logo-img" />
          <span className="navbar-logo-text">
            TIENDA<span>SPORT</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <div className={`navbar-menu ${menuAbierto ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink>
            </li>
            <li>
              <NavLink to="/productos" onClick={cerrarMenu}>Productos</NavLink>
            </li>
            {(!isAuthenticated || esAdmin) && (
              <li>
                <Link to="/#nosotros" onClick={cerrarMenu}>Nosotros</Link>
              </li>
            )}
            {isAuthenticated && !esAdmin && (
              <li>
                <NavLink to="/mis-compras" onClick={cerrarMenu}>Mis compras</NavLink>
              </li>
            )}
            {!esAdmin && (
              <li className="navbar-cart-item">
                <button
                  type="button"
                  className="nav-icon-btn"
                  onClick={manejarCarrito}
                  aria-label={`Carrito${cantidadItems > 0 ? `, ${cantidadItems} productos` : ''}`}
                >
                  <IconoCarrito />
                  {cantidadItems > 0 && (
                    <span className="nav-icon-badge">{cantidadItems}</span>
                  )}
                </button>
              </li>
            )}
          </ul>

          <div className="navbar-user">
            {isAuthenticated ? (
              <>
                {esAdmin ? (
                  <Link
                    to="/dashboard"
                    className="navbar-admin-pill"
                    onClick={cerrarMenu}
                    title="Ir al panel de administración"
                  >
                    <span className="user-avatar user-avatar--admin" aria-hidden="true">A</span>
                    <span className="navbar-admin-label">Administrador</span>
                  </Link>
                ) : (
                  <div className="navbar-user-pill">
                    <span className="user-avatar" aria-hidden="true">{inicialUsuario}</span>
                    <span className="navbar-welcome">Hola, {usuario.nombre}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="nav-icon-btn nav-icon-btn--outline"
                  onClick={() => { cerrarSesion(); cerrarMenu() }}
                  aria-label="Cerrar sesión"
                >
                  <IconoSalir />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="nav-icon-btn nav-icon-btn--login"
                onClick={cerrarMenu}
                aria-label="Iniciar sesión"
              >
                <IconoUsuario />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
