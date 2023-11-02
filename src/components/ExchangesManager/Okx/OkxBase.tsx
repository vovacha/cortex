import { useState } from 'react'

import { type ApiKey, Exchanges } from '@/interfaces'
import { Header, Select } from '@/shared-components'
import { okxMenu as menu } from '@/routes'
import { useGetApiKeys } from '@/services/queries'
import { ApiKeyContext } from './Context'

interface Props {
  children: JSX.Element | JSX.Element[]
}

export function OkxBase ({ children }: Props): JSX.Element {
  const [apiKey, setApiKey] = useState<ApiKey | undefined>(undefined)
  const getApiKeys = useGetApiKeys(Exchanges.OKX)

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

  return <>
    <Header menu={menu}/>
    <main className=''>
      <div className='bg-gray-900'>
        <div className='mx-auto'>
            <div className='px-4 sm:px-6 lg:px-8 text-white'>
              <div className='mt-10 grid grid-cols-12 gap-x-6 gap-y-8'>
                <div className='col-span-3 lg:col-span-2 lg:pr-10 min-w-max'>
                  <Select name="API Key" value={apiKey?.id ?? ''} showLabel={false} setter={setNewApiKey} options={generateApiKeyOptions()} />
                </div>
                <div className='col-span-9 lg:col-span-10 lg:pr-10'>
                  <ApiKeyContext.Provider value={apiKey}>
                    { children }
                  </ApiKeyContext.Provider>
                </div>
              </div>
            </div>
        </div>
      </div>
    </main>
  </>
}
