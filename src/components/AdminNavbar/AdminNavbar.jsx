import { useState } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { esPanelProductos } from '../../config/routes'
import { LOGO_URL } from '../../config/assets'
import { IconoSalir } from '../Navbar/NavIcons'
import './AdminNavbar.css'

function AdminNavbar() {
  const { usuario, cerrarSesion } = useAuthContext()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const enCategorias =
    location.pathname === '/categorias' || searchParams.get('tab') === 'categorias'
  const enProductos = esPanelProductos(location.pathname) && !enCategorias

  const cerrarMenu = () => setMenuAbierto(false)

  const irAlInicio = (event) => {
    cerrarMenu()
    if (location.pathname === '/' && !location.hash) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined)

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-inner">
        <Link
          to="/"
          className="admin-navbar-brand"
          onClick={irAlInicio}
          aria-label="Ir al inicio - TiendaSport"
          title="Ir al inicio"
        >
          <img src={LOGO_URL} alt="TiendaSport" className="admin-navbar-logo" />
          <span className="admin-navbar-logo-text">
            TIENDA<span>SPORT</span>
          </span>
        </Link>

        <button
          type="button"
          className="admin-navbar-toggle"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <div className={`admin-navbar-menu ${menuAbierto ? 'open' : ''}`}>
          <ul className="admin-navbar-links">
            <li>
              <NavLink to="/dashboard" end className={linkClass} onClick={cerrarMenu}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <Link
                to="/gestion-productos?tab=categorias"
                className={enCategorias ? 'active' : undefined}
                onClick={cerrarMenu}
              >
                Categorías
              </Link>
            </li>
            <li>
              <Link
                to="/gestion-productos"
                className={enProductos ? 'active' : undefined}
                onClick={cerrarMenu}
              >
                Productos
              </Link>
            </li>
            <li>
              <NavLink to="/" end className={linkClass} onClick={cerrarMenu}>
                Inicio
              </NavLink>
            </li>
          </ul>

          <div className="admin-navbar-user">
            <div className="admin-navbar-user-pill">
              <span className="admin-navbar-avatar" aria-hidden="true">A</span>
              <span className="admin-navbar-name">{usuario?.nombre || 'Administrador'}</span>
            </div>
            <button
              type="button"
              className="admin-navbar-logout"
              onClick={() => { cerrarSesion(); cerrarMenu() }}
              aria-label="Cerrar sesión"
            >
              <IconoSalir />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
