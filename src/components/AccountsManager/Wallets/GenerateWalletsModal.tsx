import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Input } from '../../../shared-components'
import { createWallet } from '../../../store/wallets/store'
import type { BaseWallet } from '../../../types'
import { generateWallet } from '../../../web3'
import { encryptWithAES } from '../../../utils'

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GenerateWalletsModal ({ setOpenModal }: ModalProps): JSX.Element {
  const [walletNumber, setWalletNumber] = useState(1)
  const dispatch = useDispatch()

  function generateWallets (): void {
    for (let i = 1; i <= walletNumber; i++) {
      const w: BaseWallet = generateWallet()
      w.privateKey = encryptWithAES(w.privateKey)
      dispatch(createWallet(w))
    }
    setOpenModal(false)
  }
  return <>
          <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input name='Amount' value={walletNumber} setter={setWalletNumber} type='number' />
            <div className='sm:col-span-6'>
              <Button onClick={() => { generateWallets() }} text='Generate Wallets' />
            </div>
          </div>
  </>
}
