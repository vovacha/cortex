import { useState } from 'react'
import type { Account } from '../../../interfaces'
import { Button, Input, Select } from '../../../shared-components'
import { useUpdateAccountMut, useGetWallets, useGetAccountGroups, useDeleteAccountMut } from '../../../services/queries'

interface Props {
  openModal: Account
  setOpenModal: React.Dispatch<React.SetStateAction<Account | false>>
}

const CHOOSE = 'Choose'

export function EditAccountModal ({ openModal: account, setOpenModal }: Props): JSX.Element {
  const [wallet, setWallet] = useState(account.evmWallet)
  const [group, setGroup] = useState(account.group)
  const [name, setAccountName] = useState(account.name)
  const updateAccount = useUpdateAccountMut()
  const deleteAccount = useDeleteAccountMut()

  const groups = useGetAccountGroups().data ?? []
  const wallets = useGetWallets().data ?? []

  const attachedEvmWallets: string[] = []

  function getWalletsOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    options.push(<option value={undefined}>{CHOOSE}</option>)
    wallets.filter(
      // Show only not attached wallets in addition to a currently attached
      (w) => !attachedEvmWallets.includes(w.address) || w.address === account.evmWallet
    ).forEach(item => {
      options.push(<option value={item.id}>{item.address}</option>)
    })
    return options
  }

  function getGroupsOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    options.push(<option value={undefined}>{CHOOSE}</option>)
    groups.forEach(item => {
      options.push(<option value={item.id}>{item.name}</option>)
    })
    return options
  }

  function editAccount (): void {
    account.evmWallet = wallet
    account.group = group
    account.name = name
    updateAccount.mutate(account)
    setOpenModal(false)
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Account Name' value={name} setter={setAccountName} />
    <Select name='Group' value={group} options={getGroupsOptions()} setter={setGroup} />
    <Select name='EVM Wallet Address' value={wallet} options={getWalletsOptions()} setter={setWallet} />
    <div className='relative sm:col-span-6'>
      <Button onClick={ editAccount } text='Save'/>
      <Button onClick={() => {
        deleteAccount.mutate(account.id)
        setOpenModal(false)
      }} text='Delete' type='danger' classNames='absolute right-0'/>
    </div>
  </div>
  </>
}
