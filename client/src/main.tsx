import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app.scss'
import './i18n-setup';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
