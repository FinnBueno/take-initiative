import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/pages'
import './index.css'
import ORB from '@owlbear-rodeo/sdk'
import { setupContextMenu } from './obr/context-menu'

ORB.onReady(() => {
  setupContextMenu()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
