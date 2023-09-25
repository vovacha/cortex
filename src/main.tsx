import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ErrorPage from './components/ErrorPage/ErrorPage'
import Sender from './components/Sender/Sender'
import Wallets from './components/Wallets/Wallets'
import './index.css'
import { store } from './store/store'
import { Provider } from 'react-redux'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'wallets',
        element: <Wallets />
      },
      {
        path: 'sender',
        element: <Sender />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
