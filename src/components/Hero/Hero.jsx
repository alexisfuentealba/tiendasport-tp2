import { Link } from 'react-router-dom'
import { IMAGES } from '../../config/assets'
import './Hero.css'

function Hero() {
  return (
    <section
      className="hero-full"
      style={{ backgroundImage: `url('${IMAGES.portada}')` }}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-badge">Nueva temporada 2026</span>
        <h1>
          Tu equipamiento deportivo,{' '}
          <span className="hero-gradient">al mejor precio</span>
        </h1>
        <p>
          Fútbol, running, gimnasio y más. Encontrá lo que necesitás para
          entrenar, competir y superar tus límites.
        </p>
        <div className="hero-actions">
          <Link to="/productos" className="hero-btn hover-btn">Explorar productos →</Link>
          <a href="#servicios" className="hero-btn hero-btn-outline hover-btn">Ver beneficios</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
