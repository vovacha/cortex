import { NavLink } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/20/solid'

import { classNames } from '../../utils'
import { type HeaderMenuItem } from '../../interfaces'
import { useSidebarStateMut } from '../../services/queries'

interface Props {
  menu?: HeaderMenuItem[]
}

// TODO: add state to the SidebarTransition and Header, currently transition doesn't work

export function Header ({ menu }: Props): JSX.Element {
  const sidebarState = useSidebarStateMut()
  return (
    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8'>
      <button type='button' className='-m-2.5 p-2.5 text-white xl:hidden' onClick={() => { sidebarState.mutate(true) }}>
        <span className='sr-only'>Open sidebar</span>
        <Bars3Icon className='h-5 w-5' aria-hidden='true' />
      </button>

      {menu !== undefined &&

        <div>
        <div className="mx-auto max-w-7xl">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
              // defaultValue={menu.find((tab) => tab?.current)?.name}
            >
              {menu.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
              >
                {menu.map((tab) => (
                  <li key={tab.name}>
                    <NavLink to={tab.href}
                    className={(navData) =>
                      classNames(navData.isActive ? 'text-indigo-400' : '')}
                    >
                      {tab.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>}
    </div>
  )
}
