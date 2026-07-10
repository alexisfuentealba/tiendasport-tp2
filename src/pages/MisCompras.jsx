import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { imagenProducto } from '../config/assets'

function MisCompras() {
  const { usuario } = useAuthContext()
  const { obtenerComprasUsuario } = useOrders()
  const location = useLocation()
  const compraReciente = location.state?.compraReciente

  const misCompras = obtenerComprasUsuario(usuario.id)

  const formatearFecha = (iso) => {
    const fecha = new Date(iso)
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="container page-content">
      <div className="page-header">
        <h1>Mis compras</h1>
        <p>Historial de compras de {usuario.nombre}</p>
      </div>

      {compraReciente && (
        <div className="alert alert-success mb-4">
          <strong>¡Compra #{compraReciente.id} confirmada!</strong>
          <span className="ms-2">
            Total: ${Number(compraReciente.total).toLocaleString('es-AR')}
          </span>
        </div>
      )}

      {misCompras.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="text-muted mb-3">Todavía no realizaste ninguna compra.</p>
          <Link to="/productos" className="btn btn-primary">Ir a productos</Link>
        </div>
      ) : (
        <div className="compras-list">
          {misCompras.map((compra) => (
            <div key={compra.id} className="card p-4 mb-3 compra-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="mb-1">Compra #{compra.id}</h5>
                  <small className="text-muted">{formatearFecha(compra.fecha)}</small>
                </div>
                <span className="badge-category">
                  Total: ${Number(compra.total).toLocaleString('es-AR')}
                </span>
              </div>
              <ul className="list-group list-group-flush">
                {compra.items.map((item) => (
                  <li key={`${compra.id}-${item.id}`} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div className="d-flex align-items-center gap-2">
                      <img src={imagenProducto(item.avatar)} alt={item.nombre} className="compra-item-img" />
                      <span>{item.nombre} × {item.cantidad}</span>
                    </div>
                    <span className="fw-bold">
                      ${(Number(item.precio) * item.cantidad).toLocaleString('es-AR')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default MisCompras
