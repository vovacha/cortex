import { useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useCreateAccountMut } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

export function CreateAccountsModal ({ setShowModal }: ModalContentProps): JSX.Element {
  const [accountNumber, setAccountNumber] = useState(1)
  const [accountName, setAccountName] = useState('')
  const createAccount = useCreateAccountMut()

  async function createAccounts (): Promise<void> {
    for (let i = 1; i <= accountNumber; i++) {
      await createAccount.mutateAsync({ name: accountName })
    }
    setShowModal(false)
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Account Name' value={accountName} setter={setAccountName} />
    <Input name='Number' value={accountNumber} setter={setAccountNumber} type='number' />
    <div className='sm:col-span-3'>
      <Button onClick={ () => { void createAccounts() }} text='Add Accounts' />
    </div>
  </div>
  </>
}
