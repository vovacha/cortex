import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/20/solid'

import { Activity } from '../Activity'
import { Sidebar } from '../Sidebar'
import { SidebarTransition } from '../SidebarTransition'

function Layout (): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      {/* Sidebar */}
      <SidebarTransition sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5'>
          <Sidebar />
        </div>
      </div>
      {/* Sidebar */}

      <div className='xl:pl-72'>
        {/* Sticky header */}
        <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8'>
          <button type='button' className='-m-2.5 p-2.5 text-white xl:hidden' onClick={() => { setSidebarOpen(true) }}>
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-5 w-5' aria-hidden='true' />
          </button>
        </div>
        {/* Sticky header */}
        <Outlet />
        <Activity />
      </div>
    </div>
  )
}

export default Layout
