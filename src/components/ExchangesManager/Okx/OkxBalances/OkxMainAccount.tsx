import { useState } from 'react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { type UseQueryResult } from '@tanstack/react-query'
import { type AccountBalanceDetail, type AccountBalance } from 'okx-api/src'
import { overrideGlobalXHR } from 'tauri-xhr'

import { Button, Checkbox, DataState, Modal, TableHead } from '@/shared-components'
import { formatCurrency } from '@/utils'
import { type ApiKey } from '@/interfaces'
import { SwapModal } from './SwapModal'

interface Props {
  apiKey: ApiKey
  balancesQuery: UseQueryResult<AccountBalance[], Error>
}

overrideGlobalXHR()

export function OkxAccounts ({ apiKey, balancesQuery }: Props): JSX.Element {
  const [balancesToSwap, setBalancesToSwap] = useState<AccountBalanceDetail[]>([])
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [swapModal, setSwapModal] = useState(false)
  const { data: balancesData, isLoading, isFetching, isError, error, refetch } = balancesQuery

  const balances = (balancesData !== undefined && balancesData.length > 0)
    ? balancesData[0].details
    : []
  const hasData = balances.length > 0

  function getBalancesTable (): JSX.Element {
    if (isError) {
      return <DataState title='Failed to retrieve balances' message={ JSON.stringify(error) } state='error'/>
    }
    if (isLoading || isFetching) {
      return <DataState state='loading' />
    }
    if (!hasData) {
      return <DataState title='No assets' message='Account has no assets available' />
    }
    const selectAllCheckbox = <>
      <Checkbox index={0} name='checkbox-all' isChecked={isSelectedAll} onChange={() => {
        !isSelectedAll
          ? setBalancesToSwap([...balances])
          : setBalancesToSwap([])
        setIsSelectedAll(!isSelectedAll)
      }} />
    </>

    return <>
      <table className='min-w-full divide-y divide-gray-700 max-h-screen'>
        <TableHead columns={[selectAllCheckbox, 'Token', 'Balance']}/>
        <tbody className='divide-y divide-gray-800'>
          {balances.map((item, i) => {
            return <tr key={i}>
              <td>
                <Checkbox index={i} name='account-checkbox' isChecked={balancesToSwap.includes(item)}
                  onChange={() => {
                    if (!balancesToSwap.includes(item)) {
                      setBalancesToSwap([...balancesToSwap, item])
                      if (balancesToSwap.length + 1 === balances.length) {
                        setIsSelectedAll(true)
                      }
                    } else {
                      setBalancesToSwap(balancesToSwap.filter(asset => asset !== item))
                      setIsSelectedAll(false)
                    }
                  }
                }/>
              </td>
              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{item.ccy}</td>
              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                {formatCurrency(item.availBal, item.ccy)}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </>
  }

  return <>
    <div className='grid grid-cols-12'>
      <div className='col-span-12 md:col-span-10 md:col-start-2'>
        <div className='font-semibold text-center mb-4'>Main account, tokens</div>
          {getBalancesTable()}
          <Modal showModal={ swapModal } setShowModal={ setSwapModal } state={ { apiKey, balancesToSwap } } Content={ SwapModal } onClose={async () => { await refetch() }}/>
          <div className='fixed bottom-2 mt-8 text-center'>
            <Button onClick={ () => { setSwapModal(true) } } disabled={balancesToSwap.filter(asset => asset.ccy !== 'USDT').length === 0}
              text={<><ArrowsRightLeftIcon className='inline h-4 w-4' aria-hidden='true'/> Swap selected to USDT  </>} />
          </div>
      </div>
    </div>
  </>
}
