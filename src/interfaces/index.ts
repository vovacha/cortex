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

export interface HasName {
  name: string
}

export interface Group {
  id: string
  name: string
}

export interface Result {
  success: boolean
  message: string
}

export interface ModalContentProps {
  state: any
  onClose: () => void
}

export * from './accounts'
export * from './exchanges'
export * from './wallets'
