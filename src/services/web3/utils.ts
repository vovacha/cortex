import { Wallet as EthersWallet } from 'ethers'
import type { Wallet } from '@/interfaces'

export function privateKeyToWalletAddress (privateKey: string): string | undefined {
  try {
    return new EthersWallet(privateKey).address
  } catch (error) {}
}

export function generateWallet (): Partial<Wallet> {
  const hdWallet = EthersWallet.createRandom()
  const w: Partial<Wallet> = {
    privateKey: hdWallet.privateKey,
    address: hdWallet.address
  }
  return w
}
