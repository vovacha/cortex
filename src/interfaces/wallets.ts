export interface Wallet {
  id: string
  privateKey: string
  address: string
}

export interface WalletState {
  wallets: Wallet[]
}

export interface WalletWithTargetAddress {
  wallet: Wallet
  targetAddress: string
}
