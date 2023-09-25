import { message } from '@tauri-apps/api/dialog'

import { useSelector, useDispatch } from 'react-redux'

import { openReadTextFile } from '../../utils'
import { privateKeyToWalletAddress } from '../../web3'

import { logger } from '../../store/logger/store'
import { addWallets } from '../../store/wallets/store'
import type { RootState } from '../../store/store'

import { type Wallet } from '../../types'
import { Button } from '../../shared-components/Button'

async function getWallets (pkeys: string[]): Promise<Wallet[]> {
  const errorKeys: string[] = []
  const wallets: Wallet[] = []
  pkeys.forEach((pkey) => {
    const address = privateKeyToWalletAddress(pkey)
    if (address === undefined) {
      errorKeys.push(pkey)
    } else {
      wallets.push({ privateKey: pkey, address })
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

export default function Wallets (): JSX.Element {
  const wallets = useSelector((state: RootState) => state.wallets)
  const dispatch = useDispatch()

  function log (message: string): void {
    dispatch(logger({ message, date: new Date() }))
  }

  async function readWalletsFromFile (): Promise<void> {
    const data = await openReadTextFile()
    if (data === undefined) {
      await message('File is empty', 'No private keys found')
    } else {
      const eol = data.includes('\r\n') ? '\r\n' : '\n'
      const keys = data.split(eol)
      dispatch(addWallets(await getWallets(keys)))
      log(`Private keys were loaded: ${keys.length}`)
    }
  }

  return (
    <main className='lg:pr-96'>
      <div className='m-5 space-y-12'>
        <div className='border-b border-white/10 pb-6'>
          <div className='mt-6 grid grid-cols-6 gap-x-6 gap-y-6'>
            <div className='sm:col-span-4'>
              <p className='mt-1 text-sm leading-6 text-gray-400'>Use a text file with private keys separated by line breaks.</p>
            </div>
            <div className='sm:col-span-2'>
              <Button onClick={() => { void readWalletsFromFile }} text='Load private keys' />
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
          <div className='bg-gray-900 py-10'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {(wallets.length > 0)
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                          <tr>
                            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                              #
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              EVM address
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Proxy
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {wallets.map((wallet, i) => (
                            <tr key={wallet.address}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{wallet.address}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        )
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
