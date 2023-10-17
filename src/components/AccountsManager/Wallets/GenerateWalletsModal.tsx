import { useState } from 'react'
import { Button, Input } from '../../../shared-components'
import type { Wallet } from '../../../interfaces'
import { generateWallet } from '../../../web3'
import { encryptWithAES } from '../../../utils'
import { useCreateWalletMut } from '../../../services/queries'

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GenerateWalletsModal ({ setOpenModal }: ModalProps): JSX.Element {
  const [walletNumber, setWalletNumber] = useState(1)
  const createWallet = useCreateWalletMut()

  async function generateWallets (): Promise<void> {
    for (let i = 1; i <= walletNumber; i++) {
      const w: Partial<Wallet> & { privateKey: string } = generateWallet()
      w.privateKey = encryptWithAES(w.privateKey)
      await createWallet.mutateAsync(w)
    }
    setOpenModal(false)
  }
  return <>
          <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input name='Amount' value={walletNumber} setter={setWalletNumber} type='number' />
            <div className='sm:col-span-6'>
              <Button onClick={() => { void generateWallets() }} text='Generate Wallets' />
            </div>
          </div>
  </>
}
