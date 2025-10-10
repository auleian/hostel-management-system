import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import RegisterPage from './Pages/Registration.jsx'
import LoginPage from './Pages/LoginPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegisterPage />
    <LoginPage />
    <App />
  </StrictMode>,
)
