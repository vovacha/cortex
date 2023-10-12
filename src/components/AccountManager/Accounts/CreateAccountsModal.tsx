import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Input } from '../../../shared-components'
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
    <Input name='Account Name' value={accountName} setter={setAccountName} />
    <Input name='Amount' value={accountNumber} setter={setAccountNumber} type='number' />
    <div className='sm:col-span-3'>
      <Button onClick={() => { createAccounts() }} text='Add Accounts' />
    </div>
  </div>
  </>
}
