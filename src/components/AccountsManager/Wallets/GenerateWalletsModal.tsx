import { useState } from 'react'

import { Button, Input } from '@/shared-components'
import type { HasName, ModalContentProps, Wallet } from '@/interfaces'
import { generateWallet } from '@/web3'
import { encryptWithAES } from '@/utils'
import { useCreateWalletMut } from '@/services/queries'

export default function GenerateWalletsModal ({ setShowModal }: ModalContentProps): JSX.Element {
  const [walletNumber, setWalletNumber] = useState(1)
  const [walletName, setWalletName] = useState('')
  const createWallet = useCreateWalletMut()

  async function generateWallets (): Promise<void> {
    for (let i = 1; i <= walletNumber; i++) {
      const w: Partial<Wallet> = generateWallet()
      w.privateKey = encryptWithAES(w.privateKey ?? '')
      w.name = walletName
      await createWallet.mutateAsync(w as Partial<Wallet> & HasName)
    }
    setShowModal(false)
  }
  return <>
          <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input name='Name' value={walletName} setter={setWalletName} />
          <Input name='Amount' value={walletNumber} setter={setWalletNumber} type='number' />
            <div className='sm:col-span-6'>
              <Button onClick={() => { void generateWallets() }} text='Generate Wallets' />
            </div>
          </div>
  </>
}
