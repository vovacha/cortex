import { useState } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import { PlusCircleIcon, LinkIcon } from '@heroicons/react/24/outline'

import { useAuth } from '../../../hooks/useAuth'
import { accountManagerMenu as menu } from '../../../routes'
import { Button, Header, Modal } from '../../../shared-components'
import { CreateAccountsModal, EditAccountModal, CreateAccountGroupModal } from './index'
import type { Account } from '../../../interfaces'
import { useDeleteAccountsMut, useDeleteAccountMut, useGetAccounts } from '../../../services/queries'

const accountGroups = [
  { name: 'All', href: '#', current: true },
  { name: 'Group 1', href: '#', current: false },
  { name: 'Group 2', href: '#', current: false }
]

interface Props {
  accountGroupId?: string
}

export function Accounts ({ accountGroupId }: Props): JSX.Element {
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [addAccountGroupModal, setAddAccountGroupModal] = useState(false)
  const [editAccountModal, setEditAccountModal] = useState<Account | undefined>()
  const auth = useAuth()
  const deleteAllAccounts = useDeleteAccountsMut()
  const deleteAccount = useDeleteAccountMut()
  const { data: accounts, isLoading, error } = useGetAccounts()

  // TODO: handle loading and exceptions properly
  if (isLoading) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <header className="pb-4 pt-6 sm:pb-6 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:pl-6 sm:leading-7">
            {accountGroups.map((item) => (
              <a key={item.name} href={item.href} className={item.current ? 'text-indigo-400' : 'text-gray-400'}>
                {item.name}
              </a>
            ))}
          </div>
          <button
            onClick={() => { setAddAccountGroupModal(true) }}
            className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Group
          </button>
        </div>
      </header>
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
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {accounts.map((account, i) => (
                            <tr className='odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='group relative whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <p className='absolute visible group-hover:invisible'>{account.name}</p>
                                <div className=''>
                                  <PencilSquareIcon onClick={() => { setEditAccountModal(account) }} className='inline text-white hover:cursor-pointer invisible group-hover:visible h-4 w-4 shrink-0' aria-hidden='true' />
                                  <TrashIcon onClick={() => { deleteAccount.mutate(account.id) }} className='inline ml-3 text-rose-600 hover:cursor-pointer invisible group-hover:visible h-4 w-4 shrink-0' aria-hidden='true' />
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.evmWallet ?? '+'}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <LinkIcon className='h-5 w-5' aria-hidden='true' />
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
    <Modal openModal={addAccountGroupModal} setOpenModal={setAddAccountGroupModal} Content={ CreateAccountGroupModal } />
    <Modal openModal={editAccountModal} setOpenModal={setEditAccountModal} Content={ EditAccountModal } />
    <div className="fixed bottom-0 p-6">
        <Button onClick={() => { setAddAccountModal(true) }} text="Add Accounts" />
        {(isDevelopment)
          ? <><Button onClick={() => { deleteAllAccounts.mutate() }} text="Clear Accounts" type="danger" />
            <Button onClick={ auth.signOut } text="Sign Out" type="danger" /></>
          : null
        }
    </div>
    </>
  )
}
