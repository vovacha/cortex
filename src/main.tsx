import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Sender from './components/Tools/Sender/Sender'
import Accounts from './components/AccountManager/Accounts/Accounts'
import Wallets from './components/AccountManager/Wallets/Wallets'
import SignIn from './components/SignIn/SignIn'
import PrivateRoute from './shared-components/PrivateRoute/PrivateRoute'
import './index.css'
import { store, persistor } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ProvideAuth } from './hooks/useAuth'
import SignUp from './components/SignUp/SignUp'
import IndexPage from './shared-components/IndexPage/IndexPage'
import ConfirmSignUp from './components/SignUp/ConfirmSignUp'
import GeneralSettings from './components/Settings/GeneralSettings/GeneralSettings'
import Exchanges from './components/Settings/Exchanges/Exchanges'
import type { HeaderMenuItem } from './types'
import { appWindow, LogicalSize } from '@tauri-apps/api/window'

// TODO: move this to the settings
await appWindow.setSize(new LogicalSize(1400, 800))

export const accountManagerMenu: HeaderMenuItem[] = [
  { name: 'Accounts', href: '/account-manager/accounts' },
  { name: 'EVM Wallets', href: '/account-manager/wallets' }
]

export const toolsMenu: HeaderMenuItem[] = [
  { name: 'Sender', href: '/tools/sender' }
]

export const settingsMenu: HeaderMenuItem[] = [
  { name: 'General', href: '/settings/general' },
  { name: 'CEX', href: '/settings/exchanges' }
]

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
        path: '/account-manager/*',
        children: [
          {
            index: true,
            element: <IndexPage to='/account-manager/accounts' />
          },
          {
            path: 'accounts',
            element: <Accounts />
          },
          {
            path: 'wallets',
            element: <Wallets />
          }
        ]
      },
      {
        path: '/tools/*',
        children: [
          {
            index: true,
            element: <IndexPage to='/tools/sender' />
          },
          {
            path: 'sender',
            element: <Sender />
          }
        ]
      },
      {
        path: '/settings/*',
        children: [
          {
            index: true,
            element: <IndexPage to='/settings/general' />
          },
          {
            path: 'general',
            element: <GeneralSettings />
          },
          {
            path: 'exchanges',
            element: <Exchanges />
          }
        ]
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
