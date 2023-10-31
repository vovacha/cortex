import { NavLink } from 'react-router-dom'
import { ChevronRightIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'

import logo from '@/images/logo.png'
import { classNames } from '@/utils'
import { menu } from '@/routes'
import { useSignOutMut } from '@/services/queries'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar (): JSX.Element {
  // TODO: simplify to one call: auth.signOut()
  const signOut = useSignOutMut()
  const auth = useAuth()
  const executeSignOut = async (): Promise<void> => {
    signOut.mutate()
    auth.signOut()
  }
  return (
    <>
      <div className='flex h-16 shrink-0 items-center'>
        <img className='h-9 w-auto' src={logo} alt='Concierge' />
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {menu.map((item) => (
                <li key={item.name}>
                {item.children === undefined
                  ? (
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
                  </NavLink>)
                  : (
                  <Disclosure as="div">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={classNames(
                            // TODO: current item processing
                            item?.current === true ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                          {item.name}
                          <ChevronRightIcon
                            className={classNames(
                              open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                              'ml-auto h-5 w-5 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel as="ul" className="mt-1 px-2">
                          {item.children?.map((subItem) => (
                            <li key={subItem.name}>
                              {/* 44px */}
                              <NavLink
                                to={subItem.href}
                                className={(navData) =>
                                  classNames(
                                    navData.isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )
                                }
                              >
                                {subItem.name}
                              </NavLink>
                            </li>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>)}
              </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
              onClick={() => { void executeSignOut() }}
            >
              <ArrowLeftOnRectangleIcon className='inline h-5 w-5' aria-hidden='true' />
              <span aria-hidden="true">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}
