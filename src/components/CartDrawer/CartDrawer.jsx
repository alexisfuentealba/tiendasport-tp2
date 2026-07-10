import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrdersContext'
import { imagenProducto } from '../../config/assets'
import './CartDrawer.css'

function CartDrawer() {
  const {
    carrito,
    total,
    cantidadItems,
    carritoAbierto,
    cerrarCarrito,
    agregarCantidad,
    quitarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCart()
  const { isAuthenticated, usuario } = useAuthContext()
  const { registrarCompra } = useOrders()
  const navigate = useNavigate()

  const manejarCompra = () => {
    if (carrito.length === 0) return

    if (!isAuthenticated) {
      cerrarCarrito()
      navigate('/login', { state: { openCartOnReturn: true, from: window.location.pathname } })
      return
    }

    const confirmar = window.confirm(
      `¿Confirmar compra por $${total.toLocaleString('es-AR')}?`
    )
    if (!confirmar) return

    const compra = registrarCompra(usuario, carrito, total)
    vaciarCarrito()
    cerrarCarrito()
    alert('¡Compra realizada con éxito!')
    navigate('/mis-compras', { state: { compraReciente: compra } })
  }

  return (
    <>
      <div
        className={`cart-backdrop ${carritoAbierto ? 'is-visible' : ''}`}
        onClick={cerrarCarrito}
        aria-hidden={!carritoAbierto}
      />

      <aside
        className={`cart-drawer offcanvas offcanvas-end ${carritoAbierto ? 'show' : ''}`}
        aria-label="Carrito de compras"
        aria-hidden={!carritoAbierto}
      >
        <div className="cart-drawer-header">
          <div>
            <p className="cart-drawer-eyebrow">Tu pedido</p>
            <h2 className="cart-drawer-title">Carrito</h2>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          {carrito.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="cart-drawer-empty-icon">🛒</div>
              <p>Todavía no agregaste productos.</p>
              <button type="button" className="btn btn-primary rounded-pill" onClick={cerrarCarrito}>
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="cart-drawer-list list-unstyled mb-0">
              {carrito.map((item) => {
                const cantidad = item.cantidad || 1
                const subtotal = Number(item.precio) * cantidad
                return (
                  <li key={item.id} className="cart-drawer-item">
                    <img src={imagenProducto(item.avatar)} alt={item.nombre} className="cart-drawer-item-img" />
                    <div className="cart-drawer-item-info">
                      <h3>{item.nombre}</h3>
                      <p>${Number(item.precio).toLocaleString('es-AR')} c/u</p>
                      <div className="cart-drawer-qty">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => quitarCantidad(item.id)}>−</button>
                        <span>{cantidad}</span>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => agregarCantidad(item.id)}>+</button>
                      </div>
                    </div>
                    <div className="cart-drawer-item-side">
                      <strong>${subtotal.toLocaleString('es-AR')}</strong>
                      <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={() => eliminarDelCarrito(item.id)}>
                        Quitar
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {carrito.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <span>Total ({cantidadItems} {cantidadItems === 1 ? 'item' : 'items'})</span>
              <strong>${total.toLocaleString('es-AR')}</strong>
            </div>
            <button type="button" className="btn btn-primary btn-lg w-100 rounded-pill" onClick={manejarCompra}>
              Realizar compra
            </button>
            <button type="button" className="btn btn-outline-secondary w-100 rounded-pill mt-2" onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
            {!isAuthenticated && (
              <p className="cart-drawer-login-hint">
                <small>Necesitás iniciar sesión para finalizar la compra.</small>
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
