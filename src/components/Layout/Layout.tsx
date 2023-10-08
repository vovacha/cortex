import { Outlet } from 'react-router-dom'

import { Activity } from '../Activity'
import { Sidebar } from '../Sidebar'
import { SidebarTransition } from '../SidebarTransition'

function Layout (): JSX.Element {
  return (
    <div>
      <SidebarTransition />
      <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5'>
          <Sidebar/>
        </div>
      </div>

      <div className='xl:pl-72'>
        <Outlet />
        <Activity />
      </div>
    </div>
  )
}

export default Layout
