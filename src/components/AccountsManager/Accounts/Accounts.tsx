import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinkIcon, PlusSmallIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { useAuth } from '../../../hooks/useAuth'
import { accountManagerMenu as menu } from '../../../routes'
import { Button, Header, Modal, TableHead } from '../../../shared-components'
import { CreateAccountsModal, LinkWalletModal, AccountGroups } from './index'
import type { Account } from '../../../interfaces'
import {
  useDeleteAccountMut, useGetAccountGroups, useGetAccountsByGroup,
  useGetWallets, useSignOutMut, useUpdateAccountMut
} from '../../../services/queries'
import { InputEdit } from '../../../shared-components/InputEdit'
import { Checkbox } from '../../../shared-components/Checkbox'
import { AssignGroupModal } from './AssignGroupModal'

export function Accounts (): JSX.Element {
  const groupId = useParams().groupId
  // Modal States
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [linkWalletModal, setLinkWalletModal] = useState<Account | false>(false)
  const [assignGroupModal, setAssignGroupModal] = useState<Account[] | false>(false)
  // States
  const [selectedAccounts, setSelectedAccounts] = useState<boolean[]>([])
  const [namesState, setNamesState] = useState<string[]>([])
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false)
  const [anySelected, setAnySelected] = useState(false)
  // Fetchers
  const getAccounts = useGetAccountsByGroup(groupId)
  const accounts = getAccounts.data ?? []
  const groups = useGetAccountGroups().data ?? []
  const wallets = useGetWallets().data ?? []
  // Mutations
  const deleteAccount = useDeleteAccountMut()
  const updateAccount = useUpdateAccountMut()

  useEffect(() => {
    if (!getAccounts.isLoading && getAccounts.data !== undefined) {
      setNamesState(getAccounts.data.map((a) => a.name))
      setSelectedAccounts(getAccounts.data.map(() => false))
    }
  }, [getAccounts.data, getAccounts.isLoading])

  useEffect(() => {
    selectedAccounts.includes(true) ? setAnySelected(true) : setAnySelected(false)
  }, [selectedAccounts])

  // TODO: simplify to one call: auth.signOut()
  const signOut = useSignOutMut()
  const auth = useAuth()
  const executeSignOut = async (): Promise<void> => {
    signOut.mutate()
    auth.signOut()
  }
  const isLoading = accounts.length === selectedAccounts.length &&
                    accounts.length === namesState.length

  async function deleteSelected (): Promise<void> {
    for (let i = 0; i < selectedAccounts.length; i++) {
      if (selectedAccounts[i]) {
        await deleteAccount.mutateAsync(accounts[i].id)
        selectedAccounts[i] = false
      }
    }
  }
  function assignGroupSelected (): void {
    setAssignGroupModal(accounts.filter((account, i) => selectedAccounts[i] ? account : null))
    // TODO: the line below is a quick fix. useEffect(...[accounts])
    //  should deselect all, but doesn't work
    setSelectedAccounts(accounts.map(() => false))
  }
  function processSelectAll (): void {
    if (selectAllCheckbox) {
      setSelectedAccounts(selectedAccounts.map(() => false))
    } else {
      setSelectedAccounts(selectedAccounts.map(() => true))
    }
    setSelectAllCheckbox(!selectAllCheckbox)
  }

  const selectAllInput = <Checkbox index={0} name='checkbox-all'
    isChecked={selectAllCheckbox} onChange={processSelectAll}/>

  const tableRows = (): JSX.Element[] => accounts.map((account, i) => (
    <tr className='group odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
      <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
        <Checkbox index={i} name='account-checkbox' isChecked={selectedAccounts[i]}
          onChange={() => {
            // TODO: can we make it O(1) instead of O(N)
            setSelectedAccounts(selectedAccounts.map((checked, j) => j === i ? !checked : checked))
          }}/>
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{i + 1}</td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <InputEdit index={i} name='account-name' value={namesState[i]}
          onChange={(name) => {
            setNamesState(namesState.map((oldName, j) => j === i ? name : oldName))
          }}
          onBlur={ (name = namesState[i]) => { void updateAccount.mutateAsync({ ...account, name }) }} />
      </td>
      {groupId === undefined
        ? <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
            {groups.find((g) => g.id === account.group)?.name}
          </td>
        : null
      }
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <span onClick={() => { setLinkWalletModal(account) }} className='cursor-pointer inline-block'>
        {wallets.find((w) => w.id === account.evmWallet)?.address ??
          <LinkIcon className='h-4 w-4' aria-hidden='true' />}</span>
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <LinkIcon className='h-4 w-4 cursor-not-allowed' aria-hidden='true' />
      </td>
    </tr>
  ))

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <AccountGroups groups={groups} currentGroup={groupId}/>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {Array.isArray(accounts) && accounts.length > 0
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        {groupId === undefined
                          ? <TableHead columns={[selectAllInput, '#', 'Name', 'Group', 'EVM Wallet', 'Starknet Wallet']}/>
                          : <TableHead columns={[selectAllInput, '#', 'Name', 'EVM Wallet', 'Starknet Wallet']}/>
                        }
                        <tbody className='divide-y divide-gray-800'>{(isLoading) ? tableRows() : null}</tbody>
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
    <Modal openModal={ addAccountModal } setOpenModal={ setAddAccountModal } Content={ CreateAccountsModal } />
    <Modal openModal={ linkWalletModal } setOpenModal={ setLinkWalletModal } Content={ LinkWalletModal } />
    <Modal openModal={ assignGroupModal } setOpenModal={ setAssignGroupModal } Content={ AssignGroupModal } />
    <div className='fixed bottom-0 p-2 pl-5'>
        <Button onClick={() => { setAddAccountModal(true) }}
          text={ <><PlusSmallIcon className='inline h-4 w-4' aria-hidden='true' /> Accounts</>} />
        {(isDevelopment)
          ? <>
            <Button onClick={ () => { void executeSignOut() } } text='Sign Out' type='secondary'/></>
          : null
        }
        <Button disabled={!anySelected} onClick={assignGroupSelected}
          text={ <><Squares2X2Icon className='inline h-4 w-4' aria-hidden='true' /> Assign Group</>} />
        <Button disabled={!anySelected} onClick={() => { void deleteSelected() }} type='danger'
          text={ <><Squares2X2Icon className='inline h-4 w-4' aria-hidden='true' /> Delete</>} />
    </div>
    </>
  )
}
