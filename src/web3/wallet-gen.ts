import { Wallet as EthersWallet } from 'ethers'
import type { BaseWallet } from '../interfaces'

export function generateWallet (): BaseWallet {
  const hdWallet = EthersWallet.createRandom()
  const w: BaseWallet = {
    privateKey: hdWallet.privateKey,
    address: hdWallet.address
  }
  return w
}
