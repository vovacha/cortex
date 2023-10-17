import { useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

import { useAuth } from '../../../hooks/useAuth'
import { accountManagerMenu as menu } from '../../../routes'
import { Button, Header, Modal } from '../../../shared-components'
import { CreateAccountsModal, EditAccountModal } from './index'
import type { Account } from '../../../interfaces'
import { useDeleteAccountsMut, useGetAccounts } from '../../../services/queries'

export function Accounts (): JSX.Element {
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [editAccountModal, setEditAccountModal] = useState<Account | undefined>()
  const auth = useAuth()
  const deleteAllAccounts = useDeleteAccountsMut()
  const { data: accounts, isLoading, error } = useGetAccounts()

  // TODO: handle loading and exceptions properly
  if (isLoading) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
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
                    {(Array.isArray(accounts) && accounts.length > 0)
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                          <tr>
                            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                              #
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Name
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              EVM Wallet
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Starknet Wallet
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {accounts.map((account, i) => (
                            <tr key={i}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.name}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.evmWallet ?? '-'}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>-</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <a className='cursor-pointer' onClick={() => { setEditAccountModal(account) }}>
                                  <PencilSquareIcon className='h-6 w-6 shrink-0' aria-hidden='true' />
                                </a>
                              </td>
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
    <Modal openModal={addAccountModal} setOpenModal={setAddAccountModal} Content={ CreateAccountsModal } />
    <Modal openModal={editAccountModal} setOpenModal={setEditAccountModal} Content={ EditAccountModal } />
    <div className="fixed bottom-0 p-6">
        <Button onClick={() => { setAddAccountModal(true) }} text="Add Accounts" />
        {(isDevelopment)
          ? <><Button onClick={() => { deleteAllAccounts.mutate() }} text="Clear Accounts" bg="bg-rose-600" />
            <Button onClick={ auth.signOut } text="Sign Out" bg="bg-rose-600" /></>
          : null
        }
    </div>
    </>
  )
}
