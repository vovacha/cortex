export interface Wallet {
  id: number
  privateKey: string
  address: string
}

export interface BaseWallet {
  privateKey: string
  address: string
}

export interface LogRecord {
  message: string
  date: Date
}

export interface Account {
  id: number
  name: string
  evmWallet?: string
}
export interface AccountState {
  count: number
  accounts: Account[]
  attachedEvmWallets: string[]
}
export interface WalletState {
  count: number
  wallets: Wallet[]
}

export interface WalletWithTargetAddress {
  wallet: Wallet
  targetAddress: string
}

export interface TransactionReceipt {
  address: string
  balance: string
  amount: string
  transactionHash?: string
  blockNumber?: number
  errorCode?: string
  errorReceipt?: string
}

export interface HeaderMenuItem {
  name: string
  href: string
  icon?: any
}
