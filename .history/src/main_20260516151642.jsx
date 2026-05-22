import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="285642663285-q7no7s1i7jgkh9ul4fu0lconj7njnpas.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
