import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Sender from './components/Sender/Sender'
import Accounts from './components/Accounts/Accounts'
import Wallets from './components/Wallets/Wallets'
import SignIn from './components/SignIn/SignIn'
import PrivateRoute from './shared-components/PrivateRoute/PrivateRoute'
import './index.css'
import { store, persistor } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ProvideAuth } from './hooks/useAuth'
import SignUp from './components/SignUp/SignUp'
import ConfirmSignUp from './components/SignUp/ConfirmSignUp'

const router = createBrowserRouter([
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/confirm-signup',
    element: <ConfirmSignUp />
  },
  {
    path: '/',
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: 'accounts',
        element: <Accounts />
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
        <ProvideAuth>
          <RouterProvider router={router} />
        </ProvideAuth>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
