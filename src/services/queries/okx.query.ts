import { type UseQueryResult, useQuery, useMutation, type UseMutationResult } from '@tanstack/react-query'
import { RestClient, type AccountBalance, type OrderRequest, type OrderResult } from 'okx-api/src'
import type { ApiKey } from '@/interfaces'

interface HasApi {
  apiKey: ApiKey
}

interface PlaceOrders extends HasApi {
  orders: OrderRequest[]
}

function getApi (apiKey: ApiKey): RestClient {
  return new RestClient({
    apiKey: apiKey.apiKey,
    apiSecret: apiKey.secretKey,
    apiPass: apiKey.passphrase
  })
}

export function useOkxAccountBalances (apiKey: ApiKey | undefined): UseQueryResult<AccountBalance[], Error> {
  return useQuery({
    retry: false,
    queryKey: ['okx', 'main', 'balances', apiKey?.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (apiKey === undefined) {
        return []
      }
      const cli = getApi(apiKey)
      return await cli.getBalance()
    }
  })
}

export function useOkxPlaceOrdersMutation (): UseMutationResult<OrderResult[], Error, PlaceOrders, any> {
  return useMutation({
    mutationFn: async ({ apiKey, orders }) => {
      const cli = getApi(apiKey)
      // process in batches of up to 20 orders
      const results: OrderResult[] = []
      const chunkSize = 20
      for (let i = 0; i < orders.length; i += chunkSize) {
        const chunk = orders.slice(i, i + chunkSize)
        results.push(...await cli.submitMultipleOrders(chunk))
      }
      return results
    }
  })
}
