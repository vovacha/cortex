import { useState } from 'react'

import { Button, Input } from '@/shared-components'
import type { HasName, ModalContentProps, Wallet } from '@/interfaces'
import { generateWallet } from '@/services/web3/utils'
import { encryptWithAES } from '@/utils'
import { useCreateWalletMut } from '@/services/queries'

export default function GenerateWalletsModal ({ onClose }: ModalContentProps): JSX.Element {
  const [form, setForm] = useState({ walletsQty: 1, walletName: '' })
  const createWallet = useCreateWalletMut()

  async function generateWallets (): Promise<void> {
    for (let i = 1; i <= form.walletsQty; i++) {
      const w: Partial<Wallet> = generateWallet()
      w.privateKey = encryptWithAES(w.privateKey ?? '')
      w.name = form.walletName
      await createWallet.mutateAsync(w as Partial<Wallet> & HasName)
    }
    onClose()
  }
  return <>
          <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input label='Name' name='walletName' form={form} setForm={setForm} />
          <Input label='Number' name='walletsQty' form={form} setForm={setForm} type='number' />
            <div className='sm:col-span-6'>
              <Button onClick={() => { void generateWallets() }} text='Generate Wallets' />
            </div>
          </div>
  </>
}
