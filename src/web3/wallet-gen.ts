import { Wallet as EthersWallet } from 'ethers'
import type { Wallet } from '../interfaces'

export function generateWallet (): Partial<Wallet> & { privateKey: string } {
  const hdWallet = EthersWallet.createRandom()
  const w: Partial<Wallet> & { privateKey: string } = {
    privateKey: hdWallet.privateKey,
    address: hdWallet.address
  }
  return w
}
