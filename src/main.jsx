import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CategoriesProvider } from './context/CategoriesContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
        <ProductsProvider>
          <CartProvider>
            <OrdersProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </OrdersProvider>
          </CartProvider>
        </ProductsProvider>
      </CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)
