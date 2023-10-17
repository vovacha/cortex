import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { appWindow, LogicalSize } from '@tauri-apps/api/window'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ProvideAuth } from './hooks/useAuth'
import { router } from './routes'

// TODO: move this to the settings
await appWindow.setSize(new LogicalSize(1400, 800))

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProvideAuth>
          <RouterProvider router={router} />
        </ProvideAuth>
        </QueryClientProvider>
  </React.StrictMode>
)
