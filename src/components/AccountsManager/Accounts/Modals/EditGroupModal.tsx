import { useEffect, useState } from 'react'
import { Button, Input } from '@/shared-components'
import { useUpdateAccountGroupMut, useGetAccountGroup } from '@/services/queries'
import type { ModalContentProps } from '@/interfaces'

type Props = ModalContentProps & { state: string }

export function EditGroupModal ({ state: groupId, onClose }: Props): JSX.Element {
  const [form, setForm] = useState({ groupName: '' })
  const getGroup = useGetAccountGroup(groupId)
  const updateGroup = useUpdateAccountGroupMut()
  const group = getGroup.data

  useEffect(() => {
    if (!getGroup.isLoading && getGroup.data !== undefined) {
      setForm({ groupName: getGroup.data.name })
    }
  }, [getGroup.data, getGroup.isLoading])

  if (group === undefined) {
    return <></>
  }

  return <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
          <Input label='Group Name' name='groupName' form={form} setForm={setForm} />
            <div className='sm:col-span-3'>
              <Button onClick={ () => {
                updateGroup.mutate({ ...group, name: form.groupName })
                onClose()
              }} text='Save' />
            </div>
        </div>
}
