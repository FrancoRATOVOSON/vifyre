import './main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { StartClient } from '@tanstack/react-start'

import { createRouter } from './router'

const router = createRouter()

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    {/* @ts-expect-error still the router infering error */}
    <StartClient router={router} />
  </React.StrictMode>
)
