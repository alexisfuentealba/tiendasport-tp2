import { useState } from 'react'
import { useProducts } from '../../context/ProductsContext'
import { useCategories } from '../../context/CategoriesContext'
import { imagenProducto } from '../../config/assets'
import './ProductoForm.css'

const productoVacio = {
  id: '',
  nombre: '',
  precio: '',
  descripcion: '',
  categoriaId: '',
  avatar: '',
}

function ProductoForm({ productoInicial = null, onGuardado, onCancelar }) {
  const { agregarProducto, editarProducto } = useProducts()
  const { categorias } = useCategories()
  const modo = productoInicial ? 'editar' : 'agregar'

  const [producto, setProducto] = useState(() =>
    productoInicial
      ? {
          id: productoInicial.id,
          nombre: productoInicial.nombre,
          precio: productoInicial.precio,
          descripcion: productoInicial.descripcion,
          categoriaId: productoInicial.categoriaId,
          avatar: productoInicial.avatar || '',
        }
      : productoVacio
  )
  const [errores, setErrores] = useState({})

  const previewSrc = imagenProducto(producto.avatar)
  const tieneImagen = Boolean(producto.avatar?.trim())

  const manejarChange = (e) => {
    const { name, value } = e.target
    setProducto({ ...producto, [name]: value })
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
      setProducto({ ...producto, avatar: reader.result })
    }
    reader.readAsDataURL(archivo)
  }

  const manejarSubmit = (e) => {
    e.preventDefault()

    const resultado =
      modo === 'editar'
        ? editarProducto(producto)
        : agregarProducto(producto)

    if (!resultado.ok) {
      setErrores(resultado.errores)
      return
    }

    alert(modo === 'editar' ? 'Producto actualizado.' : 'Producto agregado.')
    onGuardado?.()
  }

  return (
    <div className="producto-form-card producto-form-card--embedded">
      <div className="producto-form-card-header">
        <h2 className="producto-form-card-title">
          {modo === 'editar' ? 'Editar producto' : 'Nuevo producto'}
        </h2>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancelar}>
          Cerrar
        </button>
      </div>

      <form onSubmit={manejarSubmit}>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                value={producto.nombre}
                onChange={manejarChange}
                placeholder="Ej: Conjunto Deportivo Hombre"
              />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="1"
                  className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                  value={producto.precio}
                  onChange={manejarChange}
                  placeholder="24500"
                />
                {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="categoriaId" className="form-label">Categoría</label>
                <select
                  id="categoriaId"
                  name="categoriaId"
                  className={`form-select ${errores.categoriaId ? 'is-invalid' : ''}`}
                  value={producto.categoriaId}
                  onChange={manejarChange}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                {errores.categoriaId && <div className="invalid-feedback">{errores.categoriaId}</div>}
              </div>
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                value={producto.descripcion}
                onChange={manejarChange}
                placeholder="Describí el producto con al menos 10 caracteres..."
              />
              {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="imagenArchivo" className="form-label">Imagen del producto</label>
              <input
                id="imagenArchivo"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="form-control producto-form-file"
                onChange={manejarArchivoImagen}
              />
              <small className="producto-form-image-note d-block mt-2">
                Seleccioná una imagen desde tu computadora (PNG, JPG o WEBP, máx. 2 MB).
              </small>
              {tieneImagen && (
                <button
                  type="button"
                  className="btn btn-sm btn-link px-0 mt-1"
                  onClick={() => setProducto({ ...producto, avatar: '' })}
                >
                  Quitar imagen
                </button>
              )}
            </div>

            <div className="producto-form-actions">
              <button type="submit" className="btn btn-primary">
                {modo === 'editar' ? 'Guardar cambios' : 'Agregar producto'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                Cancelar
              </button>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="producto-form-preview">
              <span className="producto-form-preview-label">Vista previa</span>
              <div className="producto-form-preview-img-wrap">
                <img
                  src={previewSrc}
                  alt={producto.nombre || 'Vista previa del producto'}
                  className="producto-form-preview-img"
                />
              </div>
              <p className="producto-form-preview-path">
                {tieneImagen ? 'Imagen seleccionada' : 'Sin imagen — se usará la predeterminada'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductoForm
