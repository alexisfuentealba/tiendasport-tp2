import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { useCart } from '../context/CartContext'
import { IMAGES, imagenProducto, imagenCategoria } from '../config/assets'
import Hero from '../components/Hero/Hero'
import ProductImage from '../components/ProductImage/ProductImage'
import { HomeIcon } from './HomeIcons'
import './Home.css'

const VENTAJAS = [
  {
    icon: 'trofeo',
    titulo: 'Calidad premium',
    desc: 'Productos seleccionados de las mejores marcas del mercado deportivo.',
  },
  {
    icon: 'envio',
    titulo: 'Envíos nacionales',
    desc: 'Recibí tus productos en la puerta de tu casa de forma rápida y segura.',
  },
  {
    icon: 'garantia',
    titulo: 'Garantía oficial',
    desc: 'Productos con garantía y política de cambios flexible.',
  },
]

const CATEGORIA_ICONOS = {
  1: 'hombre',
  2: 'mujer',
  3: 'nino',
  4: 'running',
}

function Home() {
  const { productos, cargando } = useProducts()
  const { categorias, obtenerPorId } = useCategories()
  const { agregarAlCarrito, abrirCarrito } = useCart()

  const destacados = productos.slice(0, 4)

  const manejarAgregar = (producto) => {
    agregarAlCarrito(producto)
    abrirCarrito()
  }

  return (
    <div className="home-page">
      <Hero />

      <section className="home-categories home-section-light">
        <div className="home-container">
          <div className="home-section-top text-center">
            <p className="home-eyebrow">Categorías</p>
            <h2 className="home-heading home-heading-center">Encontrá lo que buscás</h2>
            <p className="home-subtitle mb-0">
              Elegí tu disciplina y descubrí equipamiento pensado para vos.
            </p>
          </div>
          <div className="home-categories-grid">
            {categorias.map((cat) => {
              const icono = CATEGORIA_ICONOS[cat.id] || 'running'

              return (
                <Link
                  key={cat.id}
                  to={`/productos?categoria=${cat.id}`}
                  className="home-category-card hover-card"
                >
                  <div className="home-category-media">
                    <img src={imagenCategoria(cat.avatar)} alt={cat.nombre} loading="lazy" />
                    <div className="home-category-overlay" aria-hidden="true" />
                  </div>
                  <div className="home-category-content">
                    <div className="home-category-icon">
                      <HomeIcon name={icono} />
                    </div>
                    <h3>{cat.nombre}</h3>
                    <p>{cat.descripcion}</p>
                    <span className="home-category-cta">
                      Explorar
                      <HomeIcon name="flecha" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="home-featured home-section-dark">
        <div className="home-container">
          <div className="home-section-header">
            <div>
              <p className="home-eyebrow home-eyebrow-light">Destacados</p>
              <h2 className="home-heading home-heading-light mb-0">Productos populares</h2>
            </div>
            <Link to="/productos" className="btn btn-light hover-btn d-none d-md-inline-flex">
              Ver más
            </Link>
          </div>

          {cargando ? (
            <p className="text-center home-loading py-5">Cargando productos...</p>
          ) : (
            <div className="row g-4">
              {destacados.map((producto) => (
                <div key={producto.id} className="col-12 col-sm-6 col-lg-3">
                  <article className="home-product-card hover-card">
                    <ProductImage
                      src={imagenProducto(producto.avatar)}
                      alt={producto.nombre}
                      className="home-product-img-link"
                      imgClassName="home-product-img"
                    />
                    <div className="home-product-body">
                      <span className="badge-category">
                        {obtenerPorId(producto.categoriaId)?.nombre || 'General'}
                      </span>
                      <h3>
                        <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                      </h3>
                      <p className="home-product-price">
                        ${producto.precio.toLocaleString('es-AR')}
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => manejarAgregar(producto)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4 d-md-none">
            <Link to="/productos" className="btn btn-light hover-btn">Ver más</Link>
          </div>
        </div>
      </section>

      <section id="nosotros" className="home-intro home-section-muted">
        <div className="home-container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="home-intro-visual">
                <img src={IMAGES.portadaIntro} alt="Deportistas entrenando" className="home-intro-img" />
                <div className="home-intro-glow" aria-hidden="true" />
                <div className="home-intro-badge">
                  <strong>+10 años</strong>
                  <span>en el rubro deportivo</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <p className="home-eyebrow">Sobre nosotros</p>
              <h2 className="home-heading">
                Equipamiento pensado para{' '}
                <span className="text-gradient">rendir al máximo</span>
              </h2>
              <p className="home-lead">
                En TiendaSport encontrás indumentaria, calzado y accesorios de calidad.
                Comprá online con envío rápido y la confianza de una tienda especializada.
              </p>
              <ul className="home-checklist">
                <li>Asesoramiento personalizado</li>
                <li>Envíos a todo el país</li>
                <li>Garantía en todos los productos</li>
              </ul>
              <div className="home-intro-actions">
                <Link to="/productos" className="btn btn-primary hover-btn">Explorar productos</Link>
                <a href="#servicios" className="btn btn-outline-primary hover-btn">Ver beneficios</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="home-benefits home-section-light">
        <div className="home-container">
          <div className="home-section-top text-center">
            <p className="home-eyebrow">Beneficios</p>
            <h2 className="home-heading home-heading-center">Comprá con confianza</h2>
            <p className="home-subtitle mb-0">
              Te acompañamos antes, durante y después de tu compra.
            </p>
          </div>
          <div className="row g-4">
            {VENTAJAS.map((item) => (
              <div key={item.titulo} className="col-md-4">
                <div className="home-benefit-card hover-card">
                  <div className="home-benefit-icon">
                    <HomeIcon name={item.icon} />
                  </div>
                  <h3>{item.titulo}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
