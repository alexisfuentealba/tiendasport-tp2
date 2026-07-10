import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { useAuthContext } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { imagenProducto } from '../config/assets'
import ProductImage from '../components/ProductImage/ProductImage'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obtenerPorId, eliminarProducto } = useProducts()
  const { obtenerPorId: obtenerCategoria } = useCategories()
  const { esAdmin } = useAuthContext()
  const { agregarAlCarrito, abrirCarrito } = useCart()

  const producto = obtenerPorId(id)

  if (!producto) {
    return (
      <main className="container page-content text-center">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h1 className="h4 mb-3">Producto no encontrado</h1>
          <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
        </div>
      </main>
    )
  }

  const categoria = obtenerCategoria(producto.categoriaId)

  const manejarEliminar = () => {
    const confirmar = window.confirm(`¿Eliminar "${producto.nombre}"?`)
    if (confirmar) {
      eliminarProducto(producto.id)
      alert('Producto eliminado.')
      navigate('/productos')
    }
  }

  return (
    <main className="container page-content">
      <div className="detail-card">
        <div className="row g-0">
          <div className="col-md-6">
            <ProductImage
              src={imagenProducto(producto.avatar)}
              alt={producto.nombre}
              className="detail-img-wrap"
              imgClassName="detail-img"
            />
          </div>
          <div className="col-md-6">
            <div className="detail-body">
              <span className="badge-category mb-3">{categoria?.nombre || 'Sin categoría'}</span>
              <h1 className="page-title mb-2">{producto.nombre}</h1>
              <p className="detail-price">${producto.precio.toLocaleString('es-AR')}</p>
              <p className="detail-desc">{producto.descripcion}</p>

              <div className="d-flex gap-2 flex-wrap">
                <Link to="/productos" className="btn btn-outline-primary">← Volver</Link>
                {!esAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      agregarAlCarrito(producto)
                      abrirCarrito()
                    }}
                  >
                    Agregar al carrito
                  </button>
                )}
                {esAdmin && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-warning rounded-pill"
                      onClick={() => navigate('/gestion-productos', { state: { producto } })}
                    >
                      Editar
                    </button>
                    <button type="button" className="btn btn-outline-danger rounded-pill" onClick={manejarEliminar}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Detail
