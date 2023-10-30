import { useEffect, useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useUpdateAccountGroupMut, useGetAccountGroup } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

type Props = Omit<ModalContentProps, 'state'> & { state: string }

export function EditGroupModal ({ state: groupId, setShowModal }: Props): JSX.Element {
  const [groupName, setGroupName] = useState<string>()
  const getGroup = useGetAccountGroup(groupId)
  const updateGroup = useUpdateAccountGroupMut()
  const group = getGroup.data

  useEffect(() => {
    if (getGroup.isLoading === false && getGroup.data !== undefined) {
      setGroupName(getGroup.data.name)
    }
  }, [getGroup.data, getGroup.isLoading])

  if (group === undefined) {
    return <></>
  }

  return <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input name='Group Name' value={groupName} setter={setGroupName} />
            <div className='sm:col-span-3'>
              <Button onClick={ () => {
                updateGroup.mutate({ ...group, name: groupName })
                setShowModal(false)
              }} text='Save' />
            </div>
        </div>
}
