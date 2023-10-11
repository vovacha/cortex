import { message } from '@tauri-apps/api/dialog'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

import { openReadTextFile, encryptWithAES } from '../../../utils'
import { privateKeyToWalletAddress } from '../../../web3'

import { logger } from '../../../store/logger/store'
import { createWallet } from '../../../store/wallets/store'
import type { RootState } from '../../../store/store'
import { Modal } from '../../../shared-components/Modal'

import type { BaseWallet } from '../../../types'
import { Button } from '../../../shared-components/Button'
import { Header } from '../../../shared-components/Header'
import GenerateWalletsModal from './GenerateWalletsModal'
import { accountManagerMenu as menu } from '../../../main'

async function getWallets (pkeys: string[]): Promise<BaseWallet[]> {
  const errorKeys: string[] = []
  const wallets: BaseWallet[] = []
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

export default function Wallets (): JSX.Element {
  const [openModal, setOpenModal] = useState(false)
  const wallets = useSelector((state: RootState) => state.wallets).wallets
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
      for (const w of await getWallets(keys)) {
        dispatch(createWallet(w))
      }
      log(`Private keys were loaded: ${keys.length}`)
    }
  }

  return (<>
    <Header menu={menu}/>
    {/* <main className='lg:pr-96'> */}
    <main className=''>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
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
                              Wallet address
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {wallets.map((wallet, i) => (
                            <tr key={wallet.address}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{wallet.address}</td>
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
    </main>
    <Modal openModal={openModal} setOpenModal={setOpenModal} Content={ GenerateWalletsModal } />
    <div className="fixed bottom-0 p-6">
      <Button onClick={() => { void readWalletsFromFile() }} text='Import private keys' />
      <Button onClick={() => { setOpenModal(true) }} text='Generate wallets' />
    </div>
    </>
  )
}
