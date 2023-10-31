import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PencilSquareIcon, PlusSmallIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

import { Button, Modal } from '@/shared-components'
import { CreateGroupModal, EditGroupModal } from './Modals'
import type { Group } from '@/interfaces'

interface Props {
  currentGroupId?: string
  groups: Group[]
}

export function AccountGroups ({ currentGroupId, groups }: Props): JSX.Element {
  const [addGroupModal, setAddGroupModal] = useState(false)
  const [editGroupModal, setEditGroupModal] = useState(false)

  // TODO: Remove hardcoded links
  const groupsLinks = groups.map((group) =>
    <NavLink key={group.id} to={`/accounts-manager/accounts/${group.id}`} className={
        ({ isActive }) => classNames(isActive ? 'text-indigo-400' : 'text-gray-400')}>
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
    { groupsLinks }
    </div>
    <div className='ml-auto'>
    { currentGroupId !== undefined
      ? <Button onClick={() => { setEditGroupModal(true) }} text={ <PencilSquareIcon className='inline h-4 w-4' aria-hidden='true' /> }
        type='secondary'/>
      : null }
    <Button onClick={() => { setAddGroupModal(true) }} text={ <><PlusSmallIcon className='inline h-4 w-4' aria-hidden='true' /> Group</>}/>
      {/* TODO: fix Buttons margins and "ml-auto" usage */}
    </div>
  </div>
  <Modal showModal={addGroupModal} setShowModal={setAddGroupModal} Content={ CreateGroupModal } />
  <Modal showModal={editGroupModal} setShowModal={setEditGroupModal} state={currentGroupId} Content={ EditGroupModal } />
</header>
</>
}
