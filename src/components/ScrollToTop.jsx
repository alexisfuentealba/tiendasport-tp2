import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    if (pathname === '/productos' && params.has('categoria')) {
      return undefined
    }

    if (hash) {
      const id = hash.replace('#', '')
      const timer = window.setTimeout(() => {
        const elemento = document.getElementById(id)
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 120)

      return () => window.clearTimeout(timer)
    }

    window.scrollTo(0, 0)
    return undefined
  }, [pathname, search, hash])

  return null
}

export default ScrollToTop
