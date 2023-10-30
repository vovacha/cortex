import { useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useCreateAccountGroupMut } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

export function CreateGroupModal ({ setShowModal }: ModalContentProps): JSX.Element {
  const [groupName, setGroupName] = useState('')
  const createGroup = useCreateAccountGroupMut()

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Group Name' value={groupName} setter={setGroupName} />
    <div className='sm:col-span-3'>
      <Button onClick={ () => {
        createGroup.mutate({ name: groupName })
        setShowModal(false)
      }} text='Add Group' />
    </div>
  </div>
  </>
}
