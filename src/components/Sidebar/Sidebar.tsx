import logo from './logo.png'
import { NavLink } from 'react-router-dom'
import { classNames } from '../../utils'
import { type HeaderMenuItem } from '../../types'
import { UserIcon, BriefcaseIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

export const menu: HeaderMenuItem[] = [
  { name: 'Account Manager', href: 'account-manager', icon: UserIcon },
  { name: 'Tools', href: 'tools', icon: BriefcaseIcon },
  { name: 'Settings', href: 'settings', icon: Cog8ToothIcon }
]

export function Sidebar (): JSX.Element {
  return (
    <>
      <div className='flex h-16 shrink-0 items-center'>
        <img className='h-8 w-auto' src={logo} alt='Concierge' />
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {menu.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={(navData) =>
                      classNames(
                        navData.isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )
                    }
                  >
                    <item.icon className='h-6 w-6 shrink-0' aria-hidden='true' />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  )
}
