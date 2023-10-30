import { useState } from 'react'
import type { Account } from '../../../interfaces'
import { Button, Select } from '../../../shared-components'
import { useUpdateAccountMut, useGetAccountGroups } from '../../../services/queries'

interface Props {
  openModal: Account[]
  setOpenModal: React.Dispatch<React.SetStateAction<Account[] | false>>
}

const CHOOSE = 'Choose'

export function AssignGroupModal ({ openModal: accounts, setOpenModal }: Props): JSX.Element {
  const [group, setGroup] = useState()
  const updateAccount = useUpdateAccountMut()
  const groups = useGetAccountGroups().data ?? []

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
    setOpenModal(false)
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
