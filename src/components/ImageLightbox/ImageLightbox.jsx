import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ImageLightbox.css'

function ImageLightbox({ src, alt, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="image-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada: ${alt}`}
    >
      <button
        type="button"
        className="image-lightbox-close"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        ×
      </button>
      <div className="image-lightbox-content" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} className="image-lightbox-img" />
      </div>
    </div>,
    document.body,
  )
}

export default ImageLightbox
