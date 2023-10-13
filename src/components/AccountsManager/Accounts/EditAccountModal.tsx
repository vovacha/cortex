import { useState } from 'react'
import type { RootState } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Select } from '../../../shared-components'
import { updateEvmWallet, updateName } from '../../../store/accounts/store'
import type { Account } from '../../../types'

interface Props {
  openModal: any
  setOpenModal: React.Dispatch<React.SetStateAction<Account | false>>
}

const CHOOSE = 'Choose Wallet'

export default function EditAccountModal ({ openModal, setOpenModal }: Props): JSX.Element {
  const [selectedWallet, setWallet] = useState(openModal.evmWallet ?? CHOOSE)
  const [selectedName, setAccountName] = useState(openModal.name)
  const attachedEvmWallets = useSelector((state: RootState) => state.accounts).attachedEvmWallets
  const wallets = useSelector((state: RootState) => state.wallets).wallets
  const dispatch = useDispatch()
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
    if (selectedAccount.evmWallet !== selectedWalletAddress) {
      dispatch(updateEvmWallet({ accountId: selectedAccount.id, wallet: selectedWalletAddress }))
    }
    if (selectedAccount.name !== selectedWallet) {
      dispatch(updateName({ accountId: selectedAccount.id, name: selectedName }))
    }
    setOpenModal(false)
  }
  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Account Name' value={selectedName} setter={setAccountName} />
    <Select name='EVM Wallet Address' value={selectedWallet} options={getWalletsOptions()} setter={setWallet} />
    <div className='sm:col-span-6'>
      <Button onClick={ editAccount } text='Save' />
    </div>
  </div>
  </>
}
