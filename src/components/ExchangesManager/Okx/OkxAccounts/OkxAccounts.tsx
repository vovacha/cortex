import { useState, useContext } from 'react'
import classNames from 'classnames'
import { ArrowPathIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/solid'

import { Button, Checkbox, DataState, TableHead } from '@/shared-components'
import { useAccountBalances } from '@/services/queries'
import { formatCurrency } from '@/utils'
import { ApiKeyContext } from '../Context'

export function OkxAccounts (): JSX.Element {
  const apiKey = useContext(ApiKeyContext)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const { data: balancesData, isLoading, isFetching, isError, error, refetch } = useAccountBalances(apiKey)

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
    if (apiKey === undefined) {
      return <DataState message='Select API key' state='empty' />
    }
    if (!hasData) {
      return <DataState title='No assets' message='Account has no assets available' />
    }
    const selectAllCheckbox = <>
      <Checkbox index={0} name='checkbox-all' isChecked={isSelectedAll} onChange={() => {
        !isSelectedAll
          ? setSelectedAssets(balances.map(item => item.ccy))
          : setSelectedAssets([])
        setIsSelectedAll(!isSelectedAll)
      }} />
    </>
    const balanceWithRefreshButton = <>
      <div>
        Balance&nbsp;
        <button title='Refresh' onClick={ async () => { await refetch() } }>
          <ArrowPathIcon className={classNames('inline h-4 w-4', { 'animate-spin': isLoading || isFetching })} aria-hidden='true'/>
        </button>
      </div>
    </>

    return <>
      <table className='min-w-full divide-y divide-gray-700 max-h-screen'>
        <TableHead columns={[selectAllCheckbox, 'Token', balanceWithRefreshButton]}/>
        <tbody className='divide-y divide-gray-800'>
          {balances.map((item, i) => {
            return <tr key={i}>
              <td>
                <Checkbox index={i} name='account-checkbox' isChecked={selectedAssets.includes(item.ccy)}
                  onChange={() => {
                    if (!selectedAssets.includes(item.ccy)) {
                      setSelectedAssets([...selectedAssets, item.ccy])
                      if (selectedAssets.length + 1 === balances.length) {
                        setIsSelectedAll(true)
                      }
                    } else {
                      setSelectedAssets(selectedAssets.filter(asset => asset !== item.ccy))
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
      <div className='col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-6 col-start-1 md:col-start-2 lg:col-start-3 xl:col-start-4 text-sm'>
          {getBalancesTable()}
          <div className='fixed bottom-0 mb-2'>
            <Button onClick={() => {}} disabled={selectedAssets.filter(asset => asset !== 'USDT').length === 0}
              text={<><ArrowsRightLeftIcon className='inline h-4 w-4' aria-hidden='true'/> Swap selected to USDT  </>} />
          </div>
      </div>
    </div>
  </>
}
