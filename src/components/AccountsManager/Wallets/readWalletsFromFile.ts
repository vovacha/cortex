import { message } from '@tauri-apps/api/dialog'
import { openReadTextFile, encryptWithAES } from '../../../utils'
import { privateKeyToWalletAddress } from '../../../web3'
import type { Wallet } from '../../../interfaces'

export async function readWalletsFromFile (): Promise<Array<Partial<Wallet>>> {
  const errorKeys: string[] = []
  const wallets: Array<Partial<Wallet>> = []
  const fileData = await openReadTextFile()
  if (fileData === undefined) {
    await message('File is empty', 'No private keys found')
    return []
  }
  const eol = fileData.includes('\r\n') ? '\r\n' : '\n'
  const pkeys = fileData.split(eol)
  pkeys.forEach((pkey) => {
    const address = privateKeyToWalletAddress(pkey)
    if (address === undefined) {
      errorKeys.push(pkey)
    } else {
      wallets.push({ privateKey: encryptWithAES(pkey), address })
    }
  })
  if (errorKeys.length > 0) {
    let errorKeysStr = errorKeys.toString()
    if (errorKeysStr.length > 100) {
      errorKeysStr = errorKeysStr.substring(0, 100) + '...'
    }
    await message('Error while loading private keys', `One or multiple keys are invalid: ${errorKeysStr}`)
    return []
  }
  return wallets
}
