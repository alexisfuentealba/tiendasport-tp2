import { useState } from 'react'
import ImageLightbox from '../ImageLightbox/ImageLightbox'
import './ProductImage.css'

function ProductImage({ src, alt, className = '', imgClassName = '', zoomable = true }) {
  const [abierto, setAbierto] = useState(false)

  const abrirLightbox = (event) => {
    if (!zoomable) return
    event.preventDefault()
    event.stopPropagation()
    setAbierto(true)
  }

  if (!zoomable) {
    return (
      <div className={`product-image-wrap ${className}`}>
        <img src={src} alt={alt} className={imgClassName} />
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className={`product-image-trigger ${className}`}
        onClick={abrirLightbox}
        aria-label={`Ampliar imagen de ${alt}`}
      >
        <img src={src} alt={alt} className={imgClassName} />
        <span className="product-image-zoom-hint" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={abierto}
        onClose={() => setAbierto(false)}
      />
    </>
  )
}

export default ProductImage
