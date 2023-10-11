import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../../../shared-components/Button'
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
            <div className='sm:col-span-6'>
              <label htmlFor='amount' className='block text-sm font-medium leading-6 text-white'>
                Amount
              </label>
              <div className='mt-2'>
                <input
                  onChange={(event) => { setWalletNumber(Number(event.target.value)) }}
                  value={walletNumber}
                  type='text'
                  name='amount'
                  id='amount'
                  autoComplete='amount'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-6'>
              <Button onClick={() => { generateWallets() }} text='Generate Wallets' />
            </div>
          </div>
  </>
}
