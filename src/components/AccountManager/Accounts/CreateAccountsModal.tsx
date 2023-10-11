import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../../../shared-components/Button'
import { createAccount } from '../../../store/accounts/store'

interface CreateAccountsModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateAccountsModal ({ setOpenModal }: CreateAccountsModalProps): JSX.Element {
  const [accountNumber, setAccountNumber] = useState(1)
  const [accountName, setAccountName] = useState('')
  const dispatch = useDispatch()

  function createAccounts (): void {
    for (let i = 1; i <= accountNumber; i++) {
      dispatch(createAccount(accountName))
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
                  value={accountName}
                  type='text'
                  name='account-name'
                  id='account-name'
                  autoComplete='account-name'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-6'>
              <label htmlFor='amount' className='block text-sm font-medium leading-6 text-white'>
                Amount
              </label>
              <div className='mt-2'>
                <input
                  onChange={(event) => { setAccountNumber(Number(event.target.value)) }}
                  value={accountNumber}
                  type='text'
                  name='amount'
                  id='amount'
                  autoComplete='amount'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <Button onClick={() => { createAccounts() }} text='Add Accounts' />
            </div>
          </div>
  </>
}
