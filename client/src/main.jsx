import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import 'virtual:windi.css'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
