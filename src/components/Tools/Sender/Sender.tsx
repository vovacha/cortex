import { message } from '@tauri-apps/api/dialog'
import { useState } from 'react'

import { openReadTextFile } from '../../../utils'
import { chainNames, validateContract, sendNativeCurrency, sendToken } from '../../../web3/sender'
import type { Wallet, WalletWithTargetAddress } from '../../../interfaces'

import { Button, Header } from '../../../shared-components'
import { Activity } from '../..'
import { toolsMenu as menu } from '../../../routes'

// TODO: refactor the whole module

async function getTargetAddresses (targetAddresses: string[], wallets: Wallet[]): Promise<WalletWithTargetAddress[]> {
  if (targetAddresses.length !== wallets.length) {
    await message('File is empty', 'No private keys found')
    return []
  }
  const errorKeys: string[] = []
  const addresses: WalletWithTargetAddress[] = []
  targetAddresses.forEach((address, i) => {
    addresses.push({ wallet: wallets[i], targetAddress: address })
  })
  if (errorKeys.length > 0) {
    let errorKeysStr = errorKeys.toString()
    if (errorKeysStr.length > 100) {
      errorKeysStr = errorKeysStr.substring(0, 100) + '...'
    }
    await message('Error while loading target EVM addresses', `One or multiple addresses are invalid: ${errorKeysStr}`)
    return []
  }
  return addresses
}

async function sleep (milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    return setTimeout(resolve, milliseconds)
  })
}

export function Sender (): JSX.Element {
  const [contract, setContract] = useState('')
  const [network, setNetwork] = useState('')
  const [amount, setAmount] = useState(0)

  const targetAddresses: WalletWithTargetAddress[] = []
  // const wallets: Wallet[] = []

  function log (message: string): void {
    // dispatch(logger({ message, date: new Date() }))
  }

  // TODO: move this to a separate file
  async function readWalletAddressesFromFile (): Promise<void> {
    const data = await openReadTextFile()
    if (data === undefined) {
      await message('File is empty', 'No private keys found')
    } else {
      const eol = data.includes('\r\n') ? '\r\n' : '\n'
      const addresses = data.split(eol)
      // dispatch(addAddresses(await getTargetAddresses(addresses, wallets.wallets)))
      log(`Target wallet addresses were loaded: ${addresses.length}`)
    }
  }

  // TODO: move this to a separate file
  async function send (): Promise<void> {
    const isValid = await validateContract(network, contract)
    const waitAfterTransaction = 1000
    if (contract.length > 0 && !isValid) {
      await message('Contract is invalid', 'Contract format is invalid or there is no code assosiated with the contract')
      return
    }
    if (amount === 0) {
      await message('Amount is 0', 'Please, write a non-zero value')
      return
    }
    const transType = contract.length === 0 ? 'native currency' : `token ${contract}`
    log(`Start Sender for ${network} ${transType}`)

    for (let i = 0; i < targetAddresses.length; i += 1) {
      const a = targetAddresses[i]
      log(`Sending ${amount} From:${a.wallet.address} To: ${a.targetAddress}`)
      let result
      if (contract.length > 0) {
        result = await sendToken(chainNames[network], a.wallet.privateKey, a.targetAddress, amount, contract)
      } else {
        result = await sendNativeCurrency(chainNames[network], a.wallet.privateKey, a.targetAddress, amount)
      }
      await sleep(waitAfterTransaction)
      log(JSON.stringify(result))
    }
    log('Finished Sender')
  }

  return (<>
    <Header menu={menu}/>
    <main className='lg:pr-96'>
      <div className='space-y-12 m-5'>
        <div className='border-b border-white/10 pb-6'>
          <div className='mt-10 grid grid-cols-6 gap-x-6 gap-y-8'>
            <div className='sm:col-span-3'>
              <label htmlFor='network' className='block text-sm font-medium leading-6 text-white'>
                Network
              </label>
              <div className='mt-2'>
                <select
                  onChange={(event) => { setNetwork(event.target.value) }}
                  value={network}
                  id='network'
                  name='network'
                  autoComplete='network-name'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black'
                >
                  {Object.keys(chainNames).map((name: string) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label htmlFor='contract-address' className='block text-sm font-medium leading-6 text-white'>
                Token contract address
              </label>
              <div className='mt-2'>
                <input
                  onChange={(event) => { setContract(event.target.value) }}
                  value={contract}
                  type='text'
                  name='contract-address'
                  id='contract-address'
                  autoComplete='contract-address'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label htmlFor='amount' className='block text-sm font-medium leading-6 text-white'>
                Amount
              </label>
              <div className='mt-2'>
                <input
                  onChange={(event) => { setAmount(Number(event.target.value)) }}
                  value={amount}
                  step='0.01'
                  min='0'
                  max='100000'
                  type='number'
                  name='amount'
                  id='amount'
                  autoComplete='amount'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-4'>
              <p className='mt-1 text-sm leading-6 text-gray-400'>
                Send native currency or tokens from account EVM wallets to target wallets. Leave token contract address blank to send the
                native currency.
              </p>
            </div>
            <div className='sm:col-span-2'>
              <Button onClick={() => { void send }} text=' Run Sender' />
            </div>
          </div>
        </div>
      </div>

      <div className='m-5 space-y-12'>
        <div className='border-b border-white/10 pb-6'>
          <div className='mt-6 grid grid-cols-6 gap-x-6 gap-y-6'>
            <div className='sm:col-span-4'>
              <p className='mt-1 text-sm leading-6 text-gray-400'>Use a text file with EVM wallet addresses separated by line breaks.</p>
            </div>
            <div className='sm:col-span-2'>
              <Button onClick={() => { void readWalletAddressesFromFile }} text='Load target addresses' />
            </div>
          </div>
        </div>
      </div>

      {/* Deployment list */}
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
          <div className='bg-gray-900 py-10'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {(targetAddresses.length > 0)
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                          <tr>
                            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                              #
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Wallet EVM address
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Target EVM address
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {targetAddresses.map((address, i) => (
                            <tr key={address.wallet.address}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{address.wallet.address}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{address.targetAddress}</td>
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
    <Activity/>
    </>
  )
}
