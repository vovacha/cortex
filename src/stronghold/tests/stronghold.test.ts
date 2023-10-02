import { describe, expect, test } from '@jest/globals'
import { Stronghold, Location } from '@tauri-apps/plugin-stronghold'

import { mockIPC } from '@tauri-apps/api/mocks'
import { invoke } from '@tauri-apps/api/tauri'

/**
 * @jest-environment jsdom
 */
describe('stronghold module', () => {
  test('recovers BIP39 from seed', async () => {
    const snapshotFilePath = '/stronghold-test-snapshot.file'
    const password = 'password'
    const vaultPath = 'vault-path-0'
    const clientPath = 'client-path-0'
    const privateKeyPath = 'record-path-0'

    mockIPC((cmd, args) => {
      if (cmd === 'plugin:stronghold|initialize') {
        return true
      }
    })
    // Read or Create a Snapshot
    const stronghold = await Stronghold.load(snapshotFilePath, password)
    // const client = await stronghold.createClient(clientPath)
    // const vault = client.getVault(vaultPath)

    // const mnemonic = 'anxiety puppy weather mask talk hole sight glance electric heart inject local'
    // const mnemonicPassphrase = undefined
    // const keyLocation = Location.generic(vaultPath, privateKeyPath)

    // const result = vault.recoverBIP39(mnemonic, keyLocation, mnemonicPassphrase)
    // console.log(result)
  }, 5000)
})
