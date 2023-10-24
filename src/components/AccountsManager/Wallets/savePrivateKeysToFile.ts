import { os, path } from '@tauri-apps/api'
import { message, save } from '@tauri-apps/api/dialog'
import { writeTextFile } from '@tauri-apps/api/fs'
import { decryptWithAES } from '../../../utils'
import { type Wallet } from '../../../interfaces'

export async function savePrivateKeysToFile (wallets: Wallet[]): Promise<void> {
  if (wallets?.length === 0) {
    await message('No wallets', 'There are no wallets to export')
    return
  }
  const homeDir = await path.homeDir()
  const filePath = await save({
    title: 'Specify file',
    defaultPath: [homeDir, 'keys-export.txt'].join(path.sep)
  })
  if (filePath === null) {
    await message('No file', 'File not selected')
    return
  }
  const privateKeys = wallets?.map((wallet, i) => decryptWithAES(wallet.privateKey))
  const content = privateKeys?.join(os.EOL)
  if (content !== undefined) {
    await writeTextFile(filePath, content, { append: false })
  }
}
