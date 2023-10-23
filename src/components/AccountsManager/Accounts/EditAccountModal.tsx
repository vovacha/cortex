import { useState } from 'react'
import type { Account, Wallet } from '../../../interfaces'
import { Button, Input, Select } from '../../../shared-components'
import { useUpdateAccountMut, useGetWallets, useDeleteAccountMut } from '../../../services/queries'

interface Props {
  openModal: any
  setOpenModal: React.Dispatch<React.SetStateAction<Account | false>>
}

const CHOOSE = 'Choose Wallet'

export function EditAccountModal ({ openModal, setOpenModal }: Props): JSX.Element {
  const [selectedWallet, setWallet] = useState(openModal.evmWallet ?? CHOOSE)
  const [selectedName, setAccountName] = useState(openModal.name)
  const updateAccount = useUpdateAccountMut()
  const deleteAccount = useDeleteAccountMut()

  const { error, data } = useGetWallets()
  if (data === undefined) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  const wallets: Wallet[] = data
  const attachedEvmWallets: string[] = []
  const selectedAccount = openModal

  function getWalletsOptions (): JSX.Element[] {
    const walletsOptions: JSX.Element[] = []
    walletsOptions.push(<option key=''>{CHOOSE}</option>)
    wallets.filter(
      // Show only not attached wallets in addition to a currently attached
      (w) => !attachedEvmWallets.includes(w.address) || w.address === selectedAccount.evmWallet
    ).forEach(w => {
      walletsOptions.push(<option key={w.id}>{w.address}</option>)
    })
    return walletsOptions
  }

  function editAccount (): void {
    const selectedWalletAddress = selectedWallet === CHOOSE ? undefined : selectedWallet
    selectedAccount.evmWallet = selectedWalletAddress
    selectedAccount.name = selectedName
    updateAccount.mutate(selectedAccount)
    setOpenModal(false)
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Account Name' value={selectedName} setter={setAccountName} />
    <Select name='EVM Wallet Address' value={selectedWallet} options={getWalletsOptions()} setter={setWallet} />
    <div className='relative sm:col-span-6'>
      <Button onClick={ editAccount } text='Save'/>
      <Button onClick={() => {
        deleteAccount.mutate(selectedAccount.id)
        setOpenModal(false)
      }} text='Delete' type='danger' classNames='absolute right-0'/>
    </div>
  </div>
  </>
}
