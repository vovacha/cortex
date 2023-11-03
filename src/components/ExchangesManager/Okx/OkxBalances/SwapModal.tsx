import type { AccountBalanceDetail, TradeMode, OrderSide, OrderType } from 'okx-api/src'
import { Button, DataState } from '@/shared-components'
import { useOkxPlaceOrdersMutation } from '@/services/queries'
import type { ApiKey, ModalContentProps } from '@/interfaces'

interface ModalState {
  balancesToSwap: AccountBalanceDetail[]
  apiKey: ApiKey
}

interface Props extends ModalContentProps {
  state: ModalState
}

export function SwapModal ({ state: { balancesToSwap, apiKey }, onClose }: Props): JSX.Element {
  const placeOrders = useOkxPlaceOrdersMutation()
  const filteredBalances = balancesToSwap.filter(b => b.ccy !== 'USDT')
  const orders = filteredBalances.map(
    b => ({
      instId: `${b.ccy}-USDT`,
      tdMode: 'cash' as TradeMode,
      side: 'sell' as OrderSide,
      ordType: 'market' as OrderType,
      sz: b.availBal
    })
  )

  function execute (): void {
    placeOrders.mutate(
      { apiKey, orders }, {
        onSuccess: (orderResults) => {
          onClose()
        }
      }
    )
  }

  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8 text-white'>
    <div className='sm:col-span-6'>
        <div className='text-lg mb-2'>Swap</div>
        <div className='text-sm mb-2'>You are about to swap next tokens to USDT:
          <ul className='pl-2'>
            {filteredBalances.map((b, i) => <li key={i}>{b.ccy}</li>)}
          </ul>
        </div>
        { placeOrders.isLoading ? <DataState state='loading' message='Swapping assets...' /> : null }
        { placeOrders.isError ? <DataState state='error' title='Error during swapping' message={ JSON.stringify(placeOrders.error) }/> : null }
        <div className='mt-8'>
          <Button onClick={ async () => { execute() }} text='Confirm' disabled={ placeOrders.isLoading } />
          <Button onClick={ () => { onClose() } } text='Close' type='secondary' />
        </div>
    </div>
  </div>
  </>
}
