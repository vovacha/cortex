import { useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useCreateAccountGroupMut } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

export function CreateGroupModal ({ onClose }: ModalContentProps): JSX.Element {
  const [form, setForm] = useState({ groupName: '' })
  const createGroup = useCreateAccountGroupMut()

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input label='Group Name' name='groupName' form={form} setForm={setForm} />
    <div className='sm:col-span-3'>
      <Button onClick={ () => {
        createGroup.mutate({ name: form.groupName })
        onClose()
      }} text='Add Group' />
    </div>
  </div>
  </>
}
