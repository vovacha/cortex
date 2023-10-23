import { createBrowserRouter } from 'react-router-dom'
import { UserIcon, BriefcaseIcon, Cog8ToothIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'
import {
  Layout, Sender, SignIn, SignUp, ConfirmSignUp, Accounts, Wallets, Exchanges,
  OkxAccounts, OkxSubAccounts, BinanceAccounts, GeneralSettings
} from './components'
import { PrivateRoute, IndexPage } from './shared-components'
import type { HeaderMenuItem } from './interfaces'

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
  { name: 'Accounts', href: '/accounts-manager/accounts/all' },
  { name: 'EVM Wallets', href: '/accounts-manager/wallets' }
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

export const router = createBrowserRouter([
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
          { index: true, element: <IndexPage to='/accounts-manager/accounts/all' /> },
          // { path: 'accounts', element: <Accounts /> },
          { path: 'accounts/:groupId', element: <Accounts /> },
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
