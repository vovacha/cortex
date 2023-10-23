import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { LinkIcon } from '@heroicons/react/24/outline'

import { useAuth } from '../../../hooks/useAuth'
import { accountManagerMenu as menu } from '../../../routes'
import { Button, Header, Modal } from '../../../shared-components'
import { CreateAccountsModal, EditAccountModal, AccountGroups } from './index'
import type { Account } from '../../../interfaces'
import { useDeleteAccountsMut, useGetAccounts, useGetAccountGroup } from '../../../services/queries'

export function Accounts (): JSX.Element {
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [editAccountModal, setEditAccountModal] = useState<Account | undefined>()
  const auth = useAuth()
  const deleteAllAccounts = useDeleteAccountsMut()
  const { data: accounts, isLoading, error } = useGetAccounts()
  const groupId = useParams().groupId ?? 'all'
  const groupName = useGetAccountGroup(groupId).data?.name ?? null

  const accountsItems = accounts?.map((account, i) => (
    <>
    { (groupId === 'all' || account.group === groupId)
      ? (
    <tr className='odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
      <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        {account.name}
      </td>
      {groupId === 'all'
        ? <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
            {groupName}
          </td>
        : null
      }
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.evmWallet ?? '+'}</td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <LinkIcon className='h-4 w-4' aria-hidden='true' />
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <PencilSquareIcon onClick={() => { setEditAccountModal(account) }} className='text-white hover:cursor-pointer h-4 w-4 shrink-0' aria-hidden='true' />
      </td>
    </tr>)
      : null }</>
  ))

  // TODO: handle loading and exceptions properly
  if (isLoading) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <AccountGroups/>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {Array.isArray(accounts) && accounts.length > 0
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
                            {groupId === 'all'
                              ? <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                                  Group
                                </th>
                              : null
                            }
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
                          {accountsItems}
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
    <div className='fixed bottom-0 p-6'>
        <Button onClick={() => { setAddAccountModal(true) }} text='Add Accounts' classNames='mr-3 mb-3' />
        {(isDevelopment)
          ? <><Button onClick={() => { deleteAllAccounts.mutate() }} text='Clear Accounts' classNames='mr-3 mb-3' type='secondary' />
            <Button onClick={ auth.signOut } text='Sign Out' type='secondary'/></>
          : null
        }
    </div>
    </>
  )
}
