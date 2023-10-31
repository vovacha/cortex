import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinkIcon, PlusSmallIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

import { accountManagerMenu as menu } from '@/routes'
import { Button, Header, Modal, TableHead, EmptyData, Checkbox, InputEdit } from '@/shared-components'
import {
  useDeleteAccountMut, useGetAccountGroups, useGetAccountsByGroup,
  useGetWallets, useUpdateAccountMut
} from '@/services/queries'
import type { Account } from '@/interfaces'

import { CreateAccountsModal, LinkWalletModal, AssignGroupModal } from './Modals'
import { AccountGroups } from './index'

export function Accounts (): JSX.Element {
  const groupId = useParams().groupId
  // Modal states
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [assignGroupModal, setAssignGroupModal] = useState(false)
  const [linkWalletModal, setLinkWalletModal] = useState(false)
  const [linkWalletAccount, setLinkWalletAccount] = useState<Account>()
  // Selected checkboxes states
  const [selectedAccounts, setSelectedAccounts] = useState<boolean[]>([])
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [isAnySelected, setIsAnySelected] = useState(false)
  // In-place edit names state
  const [accountNames, setAccountNames] = useState<string[]>([])
  // Fetchers
  const getAccounts = useGetAccountsByGroup(groupId)
  const groups = useGetAccountGroups().data ?? []
  const wallets = useGetWallets().data ?? []
  // Mutations
  const deleteAccount = useDeleteAccountMut()
  const updateAccount = useUpdateAccountMut()

  useEffect(() => {
    if (getAccounts.isLoading === false && getAccounts.data !== undefined) {
      setAccountNames(getAccounts.data.map((a) => a.name))
      setSelectedAccounts(getAccounts.data.map(() => false))
      setIsSelectedAll(false)
    }
  }, [getAccounts.data, getAccounts.isLoading])

  useEffect(() => {
    selectedAccounts.includes(true) ? setIsAnySelected(true) : setIsAnySelected(false)
  }, [selectedAccounts])

  const accounts = getAccounts.data ?? []
  const isLoading = accounts.length === selectedAccounts.length &&
    accounts.length === accountNames.length

  async function selectedDeleteOnClick (): Promise<void> {
    for (let i = 0; i < selectedAccounts.length; i++) {
      if (selectedAccounts[i]) {
        deleteAccount.mutate(accounts[i].id)
        selectedAccounts[i] = false
      }
    }
  }

  function selectedGroupOnClick (): void {
    setAssignGroupModal(true)
    setSelectedAccounts(accounts.map(() => false))
    setIsSelectedAll(false)
  }

  const selectAllCheckbox = <Checkbox index={0} name='checkbox-all'
    isChecked={isSelectedAll} onChange={() => {
      isSelectedAll
        ? setSelectedAccounts(selectedAccounts.map(() => false))
        : setSelectedAccounts(selectedAccounts.map(() => true))
      setIsSelectedAll(!isSelectedAll)
    }}/>

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
        <InputEdit index={i} name='account-name' value={accountNames[i]}
          onChange={(name) => {
            setAccountNames(accountNames.map((oldName, j) => j === i ? name : oldName))
          }}
          onBlur={ (name = accountNames[i]) => { void updateAccount.mutateAsync({ ...account, name }) }} />
      </td>
      {groupId === undefined
        ? <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
            {groups.find((g) => g.id === account.group)?.name}
          </td>
        : null
      }
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <span onClick={() => {
          setLinkWalletModal(true)
          setLinkWalletAccount(account)
        }} className='cursor-pointer inline-block'>
        {wallets.find((w) => w.id === account.evmWallet)?.address ??
          <LinkIcon className='h-4 w-4' aria-hidden='true' />}</span>
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
        <LinkIcon className='h-4 w-4 cursor-not-allowed' aria-hidden='true' />
      </td>
    </tr>
  ))

  return (<>
    <Header menu={menu}/>
    <AccountGroups groups={groups} currentGroupId={groupId}/>
    <div className='bg-gray-900 px-4 sm:px-6 lg:px-8'>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            { accounts.length > 0
              ? (
              <table className='min-w-full divide-y divide-gray-700'>
                {groupId === undefined
                  ? <TableHead columns={[selectAllCheckbox, '#', 'Name', 'Group', 'EVM Wallet', 'Starknet Wallet']}/>
                  : <TableHead columns={[selectAllCheckbox, '#', 'Name', 'EVM Wallet', 'Starknet Wallet']}/>
                }
                <tbody className='divide-y divide-gray-800'>{(isLoading) ? tableRows() : null}</tbody>
              </table>
                )
              : <EmptyData title='No Accounts' message='Get started by creating a new Account'/>}
          </div>
        </div>
      </div>
    </div>
    <Modal showModal={ addAccountModal } setShowModal={ setAddAccountModal } Content={ CreateAccountsModal } />
    <Modal showModal={ linkWalletModal } setShowModal={ setLinkWalletModal } state={linkWalletAccount} Content={ LinkWalletModal } />
    <Modal showModal={ assignGroupModal } setShowModal={ setAssignGroupModal }
      state={accounts.filter((account, i) => selectedAccounts[i] ? account : null)} Content={ AssignGroupModal } />
    <div className='fixed bottom-0 p-2 pl-5'>
        <Button onClick={() => { setAddAccountModal(true) }}
          text={ <><PlusSmallIcon className='inline h-4 w-4' aria-hidden='true' /> Accounts</>} />
        <Button disabled={!isAnySelected} onClick={selectedGroupOnClick}
          text={ <><Squares2X2Icon className='inline h-4 w-4' aria-hidden='true' /> Assign Group</>} />
        <Button disabled={!isAnySelected} onClick={() => { void selectedDeleteOnClick() }} type='danger'
          text={ <><Squares2X2Icon className='inline h-4 w-4' aria-hidden='true' /> Delete</>} />
    </div>
    </>
  )
}
