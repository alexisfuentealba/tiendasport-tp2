import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { useAuthContext } from '../context/AuthContext'
import AdminLayout from '../components/AdminLayout'
import { imagenProducto } from '../config/assets'
import './Dashboard.css'

const ACCIONES = [
  {
    titulo: 'Gestionar productos',
    desc: 'Agregar, editar y eliminar artículos',
    path: '/gestion-productos',
    icon: 'plus',
    primary: true,
  },
  {
    titulo: 'Categorías',
    desc: 'Rubros del catálogo',
    path: '/gestion-productos?tab=categorias',
    icon: 'grid',
  },
  {
    titulo: 'Ver tienda',
    desc: 'Previsualizar como cliente',
    path: '/productos',
    icon: 'store',
  },
]

function IconoDashboard({ name }) {
  if (name === 'plus') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
      </svg>
    )
  }
  if (name === 'grid') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" d="M4 6h7v7H4zM13 6h7v7h-7zM4 15h7v7H4zM13 15h7v7h-7z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M3 9l9-6 9 6v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9z" />
    </svg>
  )
}

function Dashboard() {
  const { productos } = useProducts()
  const { categorias, obtenerPorId } = useCategories()
  const { usuario } = useAuthContext()
  const navigate = useNavigate()

  const valorCatalogo = productos.reduce((total, producto) => total + producto.precio, 0)
  const recientes = [...productos].slice(-5).reverse()

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="dashboard-welcome">
          <div>
            <p className="dashboard-welcome-label">Dashboard</p>
            <h2 className="dashboard-welcome-title">
              Hola, {usuario?.nombre || 'Administrador'}
            </h2>
            <p className="dashboard-welcome-text">
              Resumen de TiendaSport: productos, categorías y accesos rápidos al catálogo.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary dashboard-welcome-btn"
            onClick={() => navigate('/gestion-productos')}
          >
            + Agregar producto
          </button>
        </div>

        <div className="row g-4 dashboard-stats">
          <div className="col-md-4">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Productos</span>
                <span className="dashboard-stat-icon dashboard-stat-icon--blue">P</span>
              </div>
              <p className="dashboard-stat-value">{productos.length}</p>
              <p className="dashboard-stat-desc">Artículos en el catálogo</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Categorías</span>
                <span className="dashboard-stat-icon dashboard-stat-icon--sky">C</span>
              </div>
              <p className="dashboard-stat-value">{categorias.length}</p>
              <p className="dashboard-stat-desc">Rubros activos</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Valor catálogo</span>
                <span className="dashboard-stat-icon dashboard-stat-icon--navy">$</span>
              </div>
              <p className="dashboard-stat-value dashboard-stat-value--money">
                ${valorCatalogo.toLocaleString('es-AR')}
              </p>
              <p className="dashboard-stat-desc">Suma de precios publicados</p>
            </div>
          </div>
        </div>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Acciones rápidas</h2>
          <div className="row g-3">
            {ACCIONES.map((accion) => (
              <div key={accion.titulo} className="col-md-4">
                <button
                  type="button"
                  className={`dashboard-action-card ${accion.primary ? 'dashboard-action-card--primary' : ''}`}
                  onClick={() => navigate(accion.path)}
                >
                  <span className="dashboard-action-icon">
                    <IconoDashboard name={accion.icon} />
                  </span>
                  <span className="dashboard-action-text">
                    <strong>{accion.titulo}</strong>
                    <small>{accion.desc}</small>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-section--last">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title mb-0">Últimos productos</h2>
            <Link to="/gestion-productos" className="dashboard-link">Gestionar todos</Link>
          </div>

          {recientes.length === 0 ? (
            <div className="dashboard-empty">
              <p className="text-muted mb-3">Todavía no hay productos cargados.</p>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/gestion-productos')}>
                Crear primer producto
              </button>
            </div>
          ) : (
            <div className="dashboard-table-wrap">
              <div className="table-responsive">
                <table className="table dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map((producto) => (
                      <tr key={producto.id}>
                        <td>
                          <div className="dashboard-product-cell">
                            <img src={imagenProducto(producto.avatar)} alt={producto.nombre} />
                            <span>{producto.nombre}</span>
                          </div>
                        </td>
                        <td>{obtenerPorId(producto.categoriaId)?.nombre || '—'}</td>
                        <td className="dashboard-price">${producto.precio.toLocaleString('es-AR')}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => navigate('/gestion-productos', { state: { producto } })}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
