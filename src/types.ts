export interface Wallet {
  privateKey: string
  address: string
}

export interface LogRecord {
  message: string
  date: Date
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
