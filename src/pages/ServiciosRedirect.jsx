import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ServiciosRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
    const timer = setTimeout(() => {
      document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(timer)
  }, [navigate])

  return null
}

export default ServiciosRedirect
