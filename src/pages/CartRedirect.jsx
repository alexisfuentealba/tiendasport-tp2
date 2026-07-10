import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartRedirect() {
  const { abrirCarrito } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    abrirCarrito()
    navigate('/productos', { replace: true })
  }, [abrirCarrito, navigate])

  return null
}

export default CartRedirect
