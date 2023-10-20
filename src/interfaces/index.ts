export interface LogRecord {
  message: string
  date: Date
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
  children?: HeaderMenuItem[]
  icon?: any
  current?: boolean
}

export interface HasId {
  id: string
}

export interface Group {
  id: string
  name: string
}

export * from './accounts'
export * from './exchanges'
export * from './wallets'
