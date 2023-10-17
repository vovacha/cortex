import { Header } from '../../../shared-components'
import { settingsMenu as menu } from '../../../routes'

export function GeneralSettings (): JSX.Element {
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">Email address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">email@email.com</dd>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
