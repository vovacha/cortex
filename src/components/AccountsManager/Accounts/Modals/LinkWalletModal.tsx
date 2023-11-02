import { useState } from 'react'
import type { Account, ModalContentProps } from '@/interfaces'
import { Button, Select } from '@/shared-components'
import { useUpdateAccountMut, useGetWallets } from '@/services/queries'
import { walletCompactView } from '@/utils'

type Props = Omit<ModalContentProps, 'state'> & { state: Account }

export function LinkWalletModal ({ state: account, onClose }: Props): JSX.Element {
  const [wallet, setWallet] = useState(account.evmWallet)
  const updateAccount = useUpdateAccountMut()
  const wallets = useGetWallets().data ?? []
  const attachedEvmWallets: string[] = []
  const CHOOSE = 'Choose'

  function getWalletsOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    options.push(<option key={CHOOSE} value={undefined}>{CHOOSE}</option>)
    wallets.filter(
      // Show only not attached wallets in addition to a currently attached
      (w) => !attachedEvmWallets.includes(w.address) || w.address === account.evmWallet
    ).forEach(item => {
      options.push(<option key={item.id} value={item.id}>{walletCompactView(item.address)}</option>)
    })
    return options
  }

  function editAccount (): void {
    account.evmWallet = wallet
    updateAccount.mutate(account)
    onClose()
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Select name='Wallet Address' value={wallet} options={getWalletsOptions()} setter={setWallet} />
    <div className='relative sm:col-span-6'>
      <Button onClick={ editAccount } text='Save'/>
    </div>
  </div>
  </>
}
