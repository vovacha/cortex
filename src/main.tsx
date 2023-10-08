import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
// import ErrorPage from './components/ErrorPage/ErrorPage'
import Sender from './components/Sender/Sender'
import Accounts from './components/Accounts/Accounts'
import Wallets from './components/Wallets/Wallets'
import './index.css'
import { store, persistor } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// const accountsMenu: HeaderMenuItem[] = [
//   { name: 'Accounts', href: 'accounts' },
//   { name: 'EVM Wallets', href: 'wallets' },
//   { name: 'Starknet Wallets', href: '#' }
// ]

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: 'accounts',
        element: <Accounts />
        // children: [
        //   {
        //     path: 'wallets',
        //     element: <Wallets />
        //   }
        // ]
      },
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
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
