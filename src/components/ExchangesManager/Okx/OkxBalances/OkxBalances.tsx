import { useState } from 'react'
import classNames from 'classnames'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

import { type ApiKey, Exchanges } from '@/interfaces'
import { DataState, Header, Select } from '@/shared-components'
import { okxMenu as menu } from '@/routes'
import { useGetApiKeys, useOkxAccountBalances } from '@/services/queries'
import { ApiKeyContext } from '../Context'
import { OkxAccounts } from './OkxMainAccount'

export function OkxBalances (): JSX.Element {
  const [apiKey, setApiKey] = useState<ApiKey>()
  const getApiKeys = useGetApiKeys(Exchanges.OKX)
  const mainAccountBalances = useOkxAccountBalances(apiKey)

  function setNewApiKey (keyId: string): void {
    for (const key of getApiKeys.data ?? []) {
      if (key.id === keyId) {
        setApiKey(key)
        return
      }
    }
    setApiKey(undefined)
  }

  function generateApiKeyOptions (): JSX.Element[] {
    const opts = [
      <option key="" value="">Choose API Key</option>
    ]
    const items = (getApiKeys.data ?? []).filter(item => item.exchange === Exchanges.OKX)
    for (const item of items) {
      opts.push(
        <option key={item.id} value={item.id}>{ item.name }</option>
      )
    }
    return opts
  }

  const isInProgress = mainAccountBalances.isLoading || mainAccountBalances.isFetching
  return <>
    <Header menu={menu}/>
    <main className=''>
      <div className='bg-gray-900'>
        <div className='grid grid-cols-12 gap-4 my-2 mx-4'>
          <div className='col-span-12 md:col-span-8 lg:col-span-6'>
            <div className='flex flex-row gap-8'>
              <Select name="API Key" value={apiKey?.id ?? ''} showLabel={false} setter={setNewApiKey} options={generateApiKeyOptions()} marginTop='' />
              <button disabled={apiKey === undefined || isInProgress} onClick={ async () => { await mainAccountBalances.refetch() }}
                className={
                  classNames(
                    'px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded-md text-sm font-semibold text-white shadow-sm',
                    { 'disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-gray-600': apiKey === undefined || isInProgress }
                  )
                }
              >
                <ArrowPathIcon className={classNames('inline h-4 w-4', { 'animate-spin': isInProgress })} aria-hidden='true'/>
                  &nbsp;Refresh balances
              </button>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-12 mt-8 text-gray-300 text-sm'>
          {apiKey === undefined
            ? <>
              <div className='col-span-12'>
                <DataState title='No data' message='Select API key' state='empty' />
              </div>
              </>
            : <>
              <ApiKeyContext.Provider value={apiKey}>
                <div className='col-span-12 md:col-span-10 md:col-start-2 lg:col-span-4 border-r border-white/5'>
                  <OkxAccounts apiKey={apiKey} balancesQuery={mainAccountBalances} />
                </div>
                <div className='col-span-12 md:col-span-10 md:col-start-2 lg:col-span-4 border-r border-white/5'>
                  <div className='font-semibold text-center mb-4'>Sub accounts, $</div>
                  <DataState title='No data' message='Work in progress' />
                </div>
                <div className='col-span-12 md:col-span-10 md:col-start-2 lg:col-span-4 h-max'>
                  <div>
                    <div className='font-semibold text-center mb-4'>Sub accounts, tokens</div>
                    <DataState title='No data' message='Work in progress' />
                  </div>
                </div>
              </ApiKeyContext.Provider>
            </>
          }
        </div>
      </div>
    </main>
  </>
}
