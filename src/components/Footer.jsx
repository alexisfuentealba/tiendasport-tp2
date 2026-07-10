import { Link, useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation()
  return (
    <footer className="footer-tiendasport">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-brand-link" aria-label="Ir al inicio - TiendaSport" title="Ir al inicio">
            <h3>TIENDA<span>SPORT</span></h3>
          </Link>
          <p>Tu tienda de confianza para equipamiento deportivo. Calidad, precio y pasión por el deporte.</p>
        </div>
        <div className="footer-col">
          <h4>Tienda</h4>
          <Link to="/productos">Productos</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/#servicios">Servicios</Link>
        </div>
        <div className="footer-col">
          <h4>Cuenta</h4>
          <Link to="/login" state={{ from: location.pathname }}>Iniciar sesión</Link>
          <Link to="/mis-compras">Mis compras</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© 2026 TiendaSport — Trabajo Práctico 2, Plataformas de Desarrollo</small>
      </div>
    </footer>
  )
}

export default Footer
