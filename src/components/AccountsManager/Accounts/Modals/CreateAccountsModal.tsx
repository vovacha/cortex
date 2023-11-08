import { useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useCreateAccountMut } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

export function CreateAccountsModal ({ onClose }: ModalContentProps): JSX.Element {
  const [form, setForm] = useState({ accountName: '', accountQty: 0 })
  const createAccount = useCreateAccountMut()

  async function createAccounts (): Promise<void> {
    for (let i = 1; i <= form.accountQty; i++) {
      await createAccount.mutateAsync({ name: form.accountName })
    }
    onClose()
  }

  return (
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input label='Account Name' name='accountName' form={form} setForm={setForm} />
    <Input label='Number' name='accountQty' form={form} setForm={setForm} type='number' />
    <div className='sm:col-span-3'>
      <Button onClick={ () => { void createAccounts() }} text='Add Accounts' />
    </div>
  </div>
  )
}
