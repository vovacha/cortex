import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Modal } from '../../../shared-components'
import { CreateAccountGroupModal } from './index'
import { useGetAccountGroups } from '../../../services/queries'
import { classNames } from '../../../utils'

export function AccountGroups (): JSX.Element {
  const [addAccountGroupModal, setAddAccountGroupModal] = useState(false)
  const { data: groups, isLoading, error } = useGetAccountGroups()

  // TODO: handle loading and exceptions properly
  if (isLoading) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  // TODO: Remove hardcoded links
  const accountsUrl = (groupId: string): string => `/accounts-manager/accounts/${groupId}`
  const groupsItems = groups?.map((group) =>
    <NavLink key={group.id} to={accountsUrl(group.name)} className={
        (navData) => classNames(navData.isActive ? 'text-indigo-400' : 'text-gray-400')}>
      {group.name}
    </NavLink>
  )

  return <>
  <header className="pl-2 pb-4 pt-4 sm:pb-4 border-b border-white/5">
  <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
    <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:leading-7">
    <NavLink key='all' to='/accounts-manager/accounts/all' className={(navData) => classNames(navData.isActive ? 'text-indigo-400' : 'text-gray-400')}>
      All
    </NavLink>
    { groupsItems }
    </div>
    <Button onClick={() => { setAddAccountGroupModal(true) }} text='Add Group' classNames='ml-auto'/>
  </div>
  <Modal openModal={addAccountGroupModal} setOpenModal={setAddAccountGroupModal} Content={ CreateAccountGroupModal } />
</header>
</>
}
