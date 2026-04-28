import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './cart/CartContext.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <App />
      </AuthProvider>
    </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
