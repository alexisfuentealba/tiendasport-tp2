import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import AdminLayout from '../components/AdminLayout'
import ProductoForm from '../components/admin/ProductoForm'
import { imagenProducto, imagenCategoria } from '../config/assets'
import './AdminProductos.css'

function SeccionCategorias() {
  const { categorias, agregarCategoria, editarCategoria, eliminarCategoria } = useCategories()
  const { productos } = useProducts()

  const categoriaVacia = { nombre: '', descripcion: '', avatar: '' }

  const [formulario, setFormulario] = useState(categoriaVacia)
  const [editandoId, setEditandoId] = useState(null)
  const [errores, setErrores] = useState({})

  const previewSrc = imagenCategoria(formulario.avatar)
  const tieneImagen = Boolean(formulario.avatar?.trim())

  const resetForm = () => {
    setFormulario(categoriaVacia)
    setEditandoId(null)
    setErrores({})
  }

  const manejarChange = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: '' })
  }

  const manejarArchivoImagen = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen (PNG, JPG, WEBP).')
      e.target.value = ''
      return
    }

    if (archivo.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar 2 MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormulario({ ...formulario, avatar: reader.result })
    }
    reader.readAsDataURL(archivo)
  }

  const manejarSubmit = (e) => {
    e.preventDefault()

    const resultado = editandoId
      ? editarCategoria({ ...formulario, id: editandoId })
      : agregarCategoria(formulario)

    if (!resultado.ok) {
      setErrores(resultado.errores)
      return
    }

    alert(editandoId ? 'Categoría actualizada.' : 'Categoría agregada.')
    resetForm()
  }

  const manejarEditar = (categoria) => {
    setEditandoId(categoria.id)
    setFormulario({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      avatar: categoria.avatar || '',
    })
    setErrores({})
  }

  const manejarEliminar = (categoria) => {
    const enUso = productos.some((p) => p.categoriaId === categoria.id)
    if (enUso) {
      alert('No podés eliminar una categoría que tiene productos asociados.')
      return
    }

    const confirmar = window.confirm(`¿Eliminar categoría "${categoria.nombre}"?`)
    if (confirmar) {
      eliminarCategoria(categoria.id)
      alert('Categoría eliminada.')
      if (editandoId === categoria.id) resetForm()
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="admin-productos-panel">
          <h2 className="admin-productos-panel-title">
            {editandoId ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <form onSubmit={manejarSubmit}>
            <div className="mb-3">
              <label htmlFor="cat-nombre" className="form-label">Nombre</label>
              <input
                id="cat-nombre"
                name="nombre"
                type="text"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                value={formulario.nombre}
                onChange={manejarChange}
              />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="cat-descripcion" className="form-label">Descripción</label>
              <textarea
                id="cat-descripcion"
                name="descripcion"
                rows="3"
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                value={formulario.descripcion}
                onChange={manejarChange}
              />
              {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="cat-imagenArchivo" className="form-label">Imagen de la categoría</label>
              <input
                id="cat-imagenArchivo"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="form-control categoria-form-file"
                onChange={manejarArchivoImagen}
              />
              <small className="admin-categoria-image-note d-block mt-2">
                Seleccioná una imagen desde tu computadora (PNG, JPG o WEBP, máx. 2 MB).
              </small>
              {tieneImagen && (
                <button
                  type="button"
                  className="btn btn-sm btn-link px-0 mt-1"
                  onClick={() => setFormulario({ ...formulario, avatar: '' })}
                >
                  Quitar imagen
                </button>
              )}

              <div className="categoria-form-preview mt-3">
                <span className="categoria-form-preview-label">Vista previa</span>
                <img src={previewSrc} alt={formulario.nombre || 'Vista previa'} />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editandoId ? 'Guardar cambios' : 'Agregar categoría'}
              </button>
              {editandoId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="admin-productos-panel">
          <h2 className="admin-productos-panel-title">Categorías cargadas</h2>
          {categorias.length === 0 ? (
            <p className="text-muted mb-0">No hay categorías cargadas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table admin-productos-table mb-0">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>
                        <img
                          src={imagenCategoria(categoria.avatar)}
                          alt={categoria.nombre}
                          className="admin-categoria-thumb"
                        />
                      </td>
                      <td>{categoria.nombre}</td>
                      <td className="admin-productos-desc">{categoria.descripcion}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => manejarEditar(categoria)}>
                            Editar
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => manejarEliminar(categoria)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminProductos() {
  const { productos, cargando, eliminarProducto } = useProducts()
  const { obtenerPorId } = useCategories()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const tabDesdeRuta = () => {
    if (location.pathname === '/categorias') return 'categorias'
    if (searchParams.get('tab') === 'categorias') return 'categorias'
    return 'productos'
  }

  const tabActiva = tabDesdeRuta()
  const tituloPanel = tabActiva === 'categorias' ? 'Categorías' : 'Productos'

  const enCategorias =
    location.pathname === '/categorias' || searchParams.get('tab') === 'categorias'
  const rutaFormulario = location.pathname === '/formulario-producto'
  const productoDesdeNavegacion = location.state?.producto ?? null
  const claveUbicacion = `${location.pathname}|${searchParams.get('tab') ?? ''}|${productoDesdeNavegacion?.id ?? ''}`

  const [claveAnterior, setClaveAnterior] = useState(claveUbicacion)
  const [formUi, setFormUi] = useState(null)

  if (claveUbicacion !== claveAnterior) {
    setClaveAnterior(claveUbicacion)
    setFormUi(null)
  }

  const mostrarFormBase = !enCategorias && (rutaFormulario || Boolean(productoDesdeNavegacion))
  const mostrarForm = formUi?.mostrarForm ?? mostrarFormBase
  const productoEditando =
    formUi?.producto !== undefined ? formUi.producto : productoDesdeNavegacion

  const abrirNuevo = () => {
    setFormUi({ mostrarForm: true, producto: null })
  }

  const abrirEditar = (producto) => {
    setFormUi({ mostrarForm: true, producto })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cerrarForm = () => {
    setFormUi({ mostrarForm: false, producto: null })
  }

  const manejarGuardado = () => {
    cerrarForm()
  }

  const manejarEliminar = (producto) => {
    const confirmar = window.confirm(`¿Eliminar "${producto.nombre}"?`)
    if (confirmar) {
      eliminarProducto(producto.id)
      alert('Producto eliminado.')
      if (productoEditando?.id === producto.id) cerrarForm()
    }
  }

  return (
    <AdminLayout titulo={tituloPanel}>
      <div className="admin-productos-page">
        {tabActiva === 'productos' && (
          <>
            <div className="admin-productos-toolbar">
              <p className="admin-productos-intro mb-0">
                Gestioná el catálogo: agregá, editá o eliminá productos con imagen, precio, categoría y descripción.
              </p>
              {!mostrarForm && (
                <button type="button" className="btn btn-primary" onClick={abrirNuevo}>
                  + Agregar producto
                </button>
              )}
            </div>

            {mostrarForm && (
              <ProductoForm
                key={productoEditando?.id ?? 'nuevo'}
                productoInicial={productoEditando}
                onGuardado={manejarGuardado}
                onCancelar={cerrarForm}
              />
            )}

            <div className="admin-productos-panel">
              <div className="admin-productos-panel-header">
                <h2 className="admin-productos-panel-title mb-0">Productos en el catálogo</h2>
                <span className="admin-productos-count">{productos.length} total</span>
              </div>

              {cargando ? (
                <p className="text-muted mb-0">Cargando productos...</p>
              ) : productos.length === 0 ? (
                <div className="admin-productos-empty">
                  <p className="text-muted mb-3">Todavía no hay productos cargados.</p>
                  <button type="button" className="btn btn-primary" onClick={abrirNuevo}>
                    Crear primer producto
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table admin-productos-table mb-0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id}>
                          <td>
                            <div className="admin-productos-cell">
                              <img src={imagenProducto(producto.avatar)} alt={producto.nombre} />
                              <span>{producto.nombre}</span>
                            </div>
                          </td>
                          <td>{obtenerPorId(producto.categoriaId)?.nombre || '—'}</td>
                          <td className="admin-productos-price">
                            ${producto.precio.toLocaleString('es-AR')}
                          </td>
                          <td className="admin-productos-desc">{producto.descripcion}</td>
                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => abrirEditar(producto)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => manejarEliminar(producto)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tabActiva === 'categorias' && <SeccionCategorias />}
      </div>
    </AdminLayout>
  )
}

export default AdminProductos
