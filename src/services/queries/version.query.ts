import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { getVersion } from '@tauri-apps/api/app'

export function useAppVersion (): UseQueryResult<string, Error> {
  return useQuery({
    queryKey: ['version'],
    queryFn: async () => { return await getVersion() }
  })
}
