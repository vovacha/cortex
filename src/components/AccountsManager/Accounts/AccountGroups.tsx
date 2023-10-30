import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PencilSquareIcon, PlusSmallIcon } from '@heroicons/react/24/solid'
import { Button, Modal } from '../../../shared-components'
import { CreateAccountGroupModal } from './index'
import { classNames } from '../../../utils'
import type { Group } from '../../../interfaces'

interface Props {
  currentGroup?: string
  groups: Group[]
}

export function AccountGroups ({ currentGroup, groups }: Props): JSX.Element {
  const [addAccountGroupModal, setAddAccountGroupModal] = useState(false)

  // TODO: Remove hardcoded links
  const accountsUrl = (groupId: string): string => `/accounts-manager/accounts/${groupId}`
  const groupsItems = groups?.map((group) =>
    <NavLink key={group.id} to={accountsUrl(group.id)} className={
        (navData) => classNames(navData.isActive ? 'text-indigo-400' : 'text-gray-400')}>
      {group.name}
    </NavLink>
  )

  return <>
  <header className="pl-2 pb-4 pt-4 sm:pb-4 border-b border-white/5">
  <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
    <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:leading-7">
    <NavLink end key='all' to='/accounts-manager/accounts' className={(navData) => classNames(navData.isActive ? 'text-indigo-400' : 'text-gray-400')}>
      All
    </NavLink>
    { groupsItems }
    </div>
    { currentGroup !== undefined
      ? <Button onClick={() => { }} text={ <PencilSquareIcon className='inline h-4 w-4' aria-hidden='true' /> } type='secondary' classNames='cursor-not-allowed ml-auto'/>
      : null }
    <Button onClick={() => { setAddAccountGroupModal(true) }} text={ <><PlusSmallIcon className='inline h-4 w-4' aria-hidden='true' /> Group</>} classNames={currentGroup === undefined ? 'ml-auto' : ''}/>
  </div>
  <Modal openModal={addAccountGroupModal} setOpenModal={setAddAccountGroupModal} Content={ CreateAccountGroupModal } />
</header>
</>
}
