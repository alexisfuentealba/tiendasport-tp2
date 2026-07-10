import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { useAuthContext } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { IMAGES } from '../config/assets'
import Card from '../components/Card'

function Productos() {
  const { productos, cargando, error, eliminarProducto } = useProducts()
  const { categorias, obtenerPorId } = useCategories()
  const { esAdmin } = useAuthContext()
  const { agregarAlCarrito, abrirCarrito } = useCart()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [busqueda, setBusqueda] = useState('')

  const categoriaParam = searchParams.get('categoria')
  const categoriaId = categoriaParam ? Number(categoriaParam) : null
  const categoriaSeleccionada = categoriaId ? obtenerPorId(categoriaId) : null
  const categoriaActiva = categoriaSeleccionada ? categoriaId : null

  const contarPorCategoria = (categoriaId) =>
    productos.filter((producto) => producto.categoriaId === categoriaId).length

  const productosFiltrados = productos.filter((producto) => {
    if (categoriaActiva && producto.categoriaId !== categoriaActiva) {
      return false
    }

    const categoria = obtenerPorId(producto.categoriaId)
    const termino = busqueda.trim().toLowerCase()

    if (!termino) return true

    return (
      producto.nombre.toLowerCase().includes(termino) ||
      (categoria?.nombre || '').toLowerCase().includes(termino)
    )
  })

  const manejarCategoria = (categoriaId) => {
    const params = new URLSearchParams(searchParams)

    if (categoriaId === null) {
      params.delete('categoria')
    } else {
      params.set('categoria', String(categoriaId))
    }

    setSearchParams(params)
  }

  const manejarAgregarCarrito = (producto) => {
    agregarAlCarrito(producto)
    abrirCarrito()
  }

  const manejarEditar = (producto) => {
    navigate('/gestion-productos', { state: { producto } })
  }

  const manejarEliminar = (producto) => {
    const confirmar = window.confirm(`¿Eliminar "${producto.nombre}"?`)
    if (confirmar) {
      eliminarProducto(producto.id)
      alert('Producto eliminado correctamente.')
    }
  }

  const hayFiltros = Boolean(busqueda.trim() || categoriaActiva)

  useEffect(() => {
    if (!categoriaActiva || cargando) return

    const filtros = document.getElementById('catalog-filtros')
    if (filtros) {
      filtros.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [categoriaActiva, cargando])

  if (cargando) {
    return <div className="loading-screen"><p>Cargando productos...</p></div>
  }

  if (error) {
    return <div className="container page-content"><p className="text-danger">{error}</p></div>
  }

  return (
    <>
      <div
        className="catalog-banner"
        style={{ backgroundImage: `url('${IMAGES.portadaIntro}')` }}
      >
        <div className="catalog-banner-overlay" aria-hidden="true" />
        <div className="catalog-banner-inner">
          <p className="catalog-banner-eyebrow">
            {categoriaSeleccionada ? 'Categoría' : 'Catálogo'}
          </p>
          <h1>{categoriaSeleccionada ? categoriaSeleccionada.nombre : 'Productos deportivos'}</h1>
          <p>
            {categoriaSeleccionada
              ? categoriaSeleccionada.descripcion
              : 'Encontrá el equipamiento ideal para tu próximo entrenamiento.'}
          </p>
        </div>
      </div>

      <main className="container page-content page-content-catalog">
        <div id="catalog-filtros" className="catalog-toolbar">
          <div className="catalog-filters">
            <span className="catalog-filters-label">Categorías</span>
            <div className="catalog-filters-list">
              <button
                type="button"
                className={`catalog-filter-btn ${categoriaActiva === null ? 'active' : ''}`}
                onClick={() => manejarCategoria(null)}
              >
                Todas
                <span className="catalog-filter-count">{productos.length}</span>
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  type="button"
                  className={`catalog-filter-btn ${categoriaActiva === categoria.id ? 'active' : ''}`}
                  onClick={() => manejarCategoria(categoria.id)}
                >
                  {categoria.nombre}
                  <span className="catalog-filter-count">{contarPorCategoria(categoria.id)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="search-box p-3">
            <label htmlFor="busqueda" className="form-label">Buscar productos</label>
            <div className="search-input-wrap">
              <input
                id="busqueda"
                type="text"
                className="form-control"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            {hayFiltros && (
              <small className="text-muted mt-2 d-block">
                Mostrando {productosFiltrados.length} de {productos.length} productos
                {categoriaSeleccionada ? ` en ${categoriaSeleccionada.nombre}` : ''}
              </small>
            )}
          </div>
        </div>

        <div className="row g-4">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="col-12 col-md-6 col-lg-4">
              <Card
                producto={producto}
                categoriaNombre={obtenerPorId(producto.categoriaId)?.nombre || 'Sin categoría'}
                esAdmin={esAdmin}
                onEditar={manejarEditar}
                onEliminar={manejarEliminar}
                onAgregarCarrito={manejarAgregarCarrito}
              />
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔎</div>
            <p className="text-muted mb-2">No se encontraron productos con esos filtros.</p>
            {hayFiltros && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setBusqueda('')
                  manejarCategoria(null)
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </main>
    </>
  )
}

export default Productos
