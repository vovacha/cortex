import { useState } from 'react'
import type { Account, ModalContentProps } from '@/interfaces'
import { Button, Select } from '@/shared-components'
import { useUpdateAccountMut, useGetAccountGroups } from '@/services/queries'

type Props = Omit<ModalContentProps, 'state'> & { state: Account[] }

export function AssignGroupModal ({ state: accounts, onClose }: Props): JSX.Element {
  const [group, setGroup] = useState()
  const updateAccount = useUpdateAccountMut()
  const groups = useGetAccountGroups().data ?? []
  const CHOOSE = 'Choose'

  function getGroupsOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    options.push(<option key={CHOOSE} value={undefined}>{CHOOSE}</option>)
    groups.forEach(item => {
      options.push(<option key={item.id} value={item.id}>{item.name}</option>)
    })
    return options
  }

  async function assignGroupToAccounts (): Promise<void> {
    for (const account of accounts) {
      account.group = group
      await updateAccount.mutateAsync(account)
    }
    onClose()
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Select name='Group' value={group} options={getGroupsOptions()} setter={setGroup} />
    <div className='relative sm:col-span-6'>
      <Button onClick={ () => { void assignGroupToAccounts() } } text='Assign Group'/>
    </div>
  </div>
  </>
}
