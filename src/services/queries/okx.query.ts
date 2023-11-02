import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { RestClient, type AccountBalance } from 'okx-api/src'
import type { ApiKey } from '@/interfaces'

export function useAccountBalances (apiKey: ApiKey | undefined): UseQueryResult<AccountBalance[], Error> {
  return useQuery({
    retry: false,
    queryKey: ['okx', 'main', 'balances', apiKey?.id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (apiKey === undefined) {
        return []
      }
      const cli = new RestClient({
        apiKey: apiKey.apiKey,
        apiSecret: apiKey.secretKey,
        apiPass: apiKey.passphrase
      })
      return await cli.getBalance()
    }
  })
}
