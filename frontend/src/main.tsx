import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

// roboto
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const node = document.getElementById('root') as HTMLElement
node.style.backgroundColor = '#3a2a4b' // Change the color to your desired background color

const root = ReactDOM.createRoot(node)

// Set the background color here

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
