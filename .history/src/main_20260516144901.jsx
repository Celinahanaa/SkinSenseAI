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
    <GoogleOAuthProvider clientId="ISI_CLIENT_ID_KAMU_DISINI">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
