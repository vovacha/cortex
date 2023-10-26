import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { LinkIcon } from '@heroicons/react/24/outline'

import { useAuth } from '../../../hooks/useAuth'
import { accountManagerMenu as menu } from '../../../routes'
import { Button, Header, Modal, TableHead } from '../../../shared-components'
import type { Account, Group } from '../../../interfaces'
import { useGetAccountGroup, useGetAccountGroups, useGetAccounts, useGetWallets, useDeleteAccountsMut, useSignOutMut } from '../../../services/queries'
import { CreateAccountsModal, EditAccountModal, AccountGroups } from './index'

export function AccountsAll (): JSX.Element {
  const { data: accounts } = useGetAccounts()
  // TODO: use loading template https://github.com/ConciergeApplication/concierge/issues/23
  if (accounts === undefined) { return <h1 color='white'>Loading</h1> }
  return <AccountsBase accounts={accounts}/>
}

export function AccountsByGroup (): JSX.Element {
  const { data: accounts } = useGetAccounts()
  const groupId = useParams().groupId ?? 'should not happen'
  const { data: accountGroup } = useGetAccountGroup(groupId)
  // TODO: use loading template https://github.com/ConciergeApplication/concierge/issues/23
  if (accounts === undefined || accountGroup === undefined) {
    return <h1 color='white'>Loading</h1>
  }
  return <AccountsBase accounts={accounts} group={accountGroup} />
}

interface Props {
  accounts: Account[]
  group?: Group
}

function AccountsBase ({ accounts, group }: Props): JSX.Element {
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [editAccountModal, setEditAccountModal] = useState<Account | undefined>()
  const deleteAllAccounts = useDeleteAccountsMut()

  const signOut = useSignOutMut()
  const auth = useAuth()
  const executeSignOut = async (): Promise<void> => {
    signOut.mutate()
    auth.signOut()
  }
  
  const groups = useGetAccountGroups().data ?? []
  const wallets = useGetWallets().data ?? []

  const tableRows = accounts.filter(
    // If the Group is selected, show Accounts belonging to the Group. Otherwise show all Accounts
    (a) => group === undefined || a.group === group.id ? a : null
  ).map((account, i) => (
    <tr className='odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
      <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        {account.name}
      </td>
      {group === undefined
        ? <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
            {groups.find((g) => g.id === account.group)?.name}
          </td>
        : null
      }
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        {wallets.find((w) => w.id === account.evmWallet)?.address ??
          <LinkIcon className='h-4 w-4 cursor-not-allowed' aria-hidden='true' />}
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <LinkIcon className='h-4 w-4 cursor-not-allowed' aria-hidden='true' />
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <PencilSquareIcon onClick={() => { setEditAccountModal(account) }}
          className='text-white hover:cursor-pointer h-4 w-4 shrink-0' aria-hidden='true' />
      </td>
    </tr>
  ))

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <AccountGroups groups={groups} currentGroup={group}/>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {Array.isArray(accounts) && accounts.length > 0
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        {group === undefined
                          ? <TableHead columns={['#', 'Name', 'Group', 'EVM Wallet', 'Starknet Wallet', '']}/>
                          : <TableHead columns={['#', 'Name', 'EVM Wallet', 'Starknet Wallet', '']}/>
                        }
                        <tbody className='divide-y divide-gray-800'>{tableRows}</tbody>
                      </table>
                        )
                      : null}
                      {/* TODO: use empty table template https://github.com/ConciergeApplication/concierge/issues/22 */}
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
          ? <><Button onClick={() => { deleteAllAccounts.mutate() }} text='Clear Accounts'
                classNames='mr-3 mb-3' type='secondary' />
            <Button onClick={ () => { void executeSignOut() } } text='Sign Out' type='secondary' classNames='mr-3 mb-3'/></>
          : null
        }
    </div>
    </>
  )
}