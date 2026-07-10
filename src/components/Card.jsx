import { Link } from 'react-router-dom'
import { imagenProducto } from '../config/assets'
import ProductImage from './ProductImage/ProductImage'

function Card({ producto, categoriaNombre, esAdmin, onEditar, onEliminar, onAgregarCarrito }) {
  return (
    <div className="card product-card hover-card h-100">
      <ProductImage
        src={imagenProducto(producto.avatar)}
        alt={producto.nombre}
        className="product-card-img-wrap"
        imgClassName="product-card-img"
      />
      <div className="product-card-body d-flex flex-column">
        <span className="badge-category mb-2">{categoriaNombre}</span>
        <h5 className="product-card-title">{producto.nombre}</h5>
        <p className="product-card-desc flex-grow-1">{producto.descripcion}</p>
        <p className="product-card-price">${producto.precio.toLocaleString('es-AR')}</p>

        <div className="d-grid gap-2 mt-auto">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-primary btn-sm">
            Ver detalles
          </Link>
          {!esAdmin && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAgregarCarrito(producto)}>
              + Agregar al carrito
            </button>
          )}
        </div>

        {esAdmin && (
          <div className="admin-actions">
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-outline-warning btn-sm rounded-pill" onClick={() => onEditar(producto)}>
                Editar
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => onEliminar(producto)}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
