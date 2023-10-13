import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Sender from './components/Tools/Sender/Sender'
import Accounts from './components/AccountsManager/Accounts/Accounts'
import Wallets from './components/AccountsManager/Wallets/Wallets'
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
import { UserIcon, BriefcaseIcon, Cog8ToothIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'
import OkxAccounts from './components/ExchangesManager/Okx/OkxAccounts/OkxAccounts'
import OkxSubAccounts from './components/ExchangesManager/Okx/OkxSubAccounts/OkxSubAccounts'
import BinanceAccounts from './components/ExchangesManager/Binance/BinanceAccounts/BinanceAccounts'

// TODO: move this to the settings
await appWindow.setSize(new LogicalSize(1400, 800))

// Main Sidebar menu
export const menu: HeaderMenuItem[] = [
  { name: 'Account Manager', href: 'accounts-manager', icon: UserIcon },
  {
    name: 'CEX Manager',
    href: 'exchanges-manager',
    icon: BuildingLibraryIcon,
    children: [
      { name: 'OKX', href: 'exchanges-manager/okx' },
      { name: 'Binance', href: 'exchanges-manager/binance' }
    ]
  },
  { name: 'Tools', href: 'tools', icon: BriefcaseIcon },
  { name: 'Settings', href: 'settings', icon: Cog8ToothIcon }
]

// Sub-menus
export const accountManagerMenu: HeaderMenuItem[] = [
  { name: 'Accounts', href: '/account-manager/accounts' },
  { name: 'EVM Wallets', href: '/account-manager/wallets' }
]
export const okxMenu: HeaderMenuItem[] = [
  { name: 'Accounts', href: '/exchanges-manager/okx/accounts' },
  { name: 'Sub Accounts', href: '/exchanges-manager/okx/sub-accounts' }
]
export const binanceMenu: HeaderMenuItem[] = [
  { name: 'Accounts', href: '/exchanges-manager/binance/accounts' }
]
export const toolsMenu: HeaderMenuItem[] = [
  { name: 'Sender', href: '/tools/sender' }
]
export const settingsMenu: HeaderMenuItem[] = [
  { name: 'General', href: '/settings/general' },
  { name: 'CEX', href: '/settings/exchanges' }
]

const router = createBrowserRouter([
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/confirm-signup', element: <ConfirmSignUp /> },
  {
    path: '/',
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: '/accounts-manager/*',
        children: [
          { index: true, element: <IndexPage to='/accounts-manager/accounts' /> },
          { path: 'accounts', element: <Accounts /> },
          { path: 'wallets', element: <Wallets /> }
        ]
      },
      {
        path: '/exchanges-manager/okx/*',
        children: [
          { index: true, element: <IndexPage to='/exchanges-manager/okx/accounts' /> },
          { path: 'accounts', element: <OkxAccounts /> },
          { path: 'sub-accounts', element: <OkxSubAccounts /> }
        ]
      },
      {
        path: '/exchanges-manager/binance/*',
        children: [
          { index: true, element: <IndexPage to='/exchanges-manager/binance/accounts' /> },
          { path: 'accounts', element: <BinanceAccounts /> }
        ]
      },
      {
        path: '/tools/*',
        children: [
          { index: true, element: <IndexPage to='/tools/sender' /> },
          { path: 'sender', element: <Sender /> }
        ]
      },
      {
        path: '/settings/*',
        children: [
          { index: true, element: <IndexPage to='/settings/general' /> },
          { path: 'general', element: <GeneralSettings /> },
          { path: 'exchanges', element: <Exchanges /> }
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
