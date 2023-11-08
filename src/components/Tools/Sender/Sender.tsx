import { useState } from 'react'

import { Header, Input, SelectNew } from '@/shared-components'
import { toolsMenu as menu } from '@/routes'
import { type Chain, chains } from '@/services/web3/chains'

export function Sender (): JSX.Element {
  const [form, setForm] = useState({ amount: 0, chain: '', contractAddress: '' })

  function getOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    chains.forEach((chain: Chain) => {
      options.push(<option key={chain.name} value={chain.name}>{chain.name}</option>)
    })
    return options
  }

  return <>
  <Header menu={menu}/>
  <div className='bg-gray-900'>
    <div className='mx-auto'>
        <div className='px-4 sm:px-6 lg:px-8 text-white'>
          <div className='mt-10 grid grid-cols-12'>
            <div className='col-span-12 sm:col-span-9 border-r border-white/5'>

            </div>
            <div className='col-span-12 sm:col-span-3 h-max'>
              <SelectNew label='Chain' name='chain' form={form} options={getOptions()} setForm={setForm} />
              <Input label='Amount' name='amount' form={form} setForm={setForm} type='number' />
              <Input label='Contract' name='contractAddress' form={form} setForm={setForm} />
            </div>
          </div>
        </div>
    </div>
  </div></>
}
