import { useState } from 'react'
import { Button, Input } from '../../../shared-components'
import { useCreateAccountGroupMut } from '../../../services/queries'

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateAccountGroupModal ({ setOpenModal }: Props): JSX.Element {
  const [groupName, setGroupName] = useState('')
  const createGroup = useCreateAccountGroupMut()

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Input name='Group Name' value={groupName} setter={setGroupName} />
    <div className='sm:col-span-3'>
      <Button onClick={ () => {
        createGroup.mutate({ name: groupName })
        setOpenModal(false)
      }} text='Add Group' />
    </div>
  </div>
  </>
}
