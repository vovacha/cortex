import { useState } from 'react'
import type { RootState } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../shared-components/Button'
import { updateEvmWallet, updateName } from '../../../store/accounts/store'
import type { Account } from '../../../types'

interface ModalProps {
  openModal: any
  setOpenModal: React.Dispatch<React.SetStateAction<Account | false>>
}

const chooseWallet = 'Choose wallet'

export default function EditAccountModal ({ openModal, setOpenModal }: ModalProps): JSX.Element {
  const [selectedWallet, setWallet] = useState(openModal.evmWallet ?? chooseWallet)
  const [selectedName, setAccountName] = useState(openModal.name)
  const attachedEvmWallets = useSelector((state: RootState) => state.accounts).attachedEvmWallets
  const wallets = useSelector((state: RootState) => state.wallets).wallets
  const dispatch = useDispatch()
  const selectedAccount = openModal

  function getWalletsOptions (): JSX.Element[] {
    const walletsOptions: JSX.Element[] = []
    walletsOptions.push(<option key=''>Choose wallet</option>)
    wallets.filter(
      // Show only not attached wallets in addition to a currently attached
      (w) => !attachedEvmWallets.includes(w.address) || w.address === selectedAccount.evmWallet
    ).forEach(w => {
      walletsOptions.push(<option key={w.id}>{w.address}</option>)
    })
    return walletsOptions
  }

  function editAccount (): void {
    const selectedWalletAddress = selectedWallet === chooseWallet ? undefined : selectedWallet
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
          <div className='sm:col-span-6'>
              <label htmlFor='account-name' className='block text-sm font-medium leading-6 text-white'>
                Account Name
              </label>
              <div className='mt-2'>
                <input
                  onChange={(event) => { setAccountName(event.target.value) }}
                  value={selectedName}
                  type='text'
                  name='account-name'
                  id='account-name'
                  autoComplete='account-name'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-6'>
              <label htmlFor='wallet' className='block text-sm font-medium leading-6 text-white'>
                EVM Wallet Address
              </label>
              <div className='mt-2'>
                <select
                  onChange={(event) => { setWallet(event.target.value) }}
                  value={selectedWallet}
                  id='wallet'
                  name='wallet'
                  autoComplete='wallet'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black'
                  // defaultValue={selectedAccount.evmWallet ?? 'Choose wallet'}
                >
                  {getWalletsOptions()}
                </select>
              </div>
            </div>

            <div className='sm:col-span-6'>
              <Button onClick={ editAccount } text='Save' />
            </div>
          </div>
  </>
}
