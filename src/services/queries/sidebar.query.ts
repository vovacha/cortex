import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'

// Queries:

let sidebarState = false

export function useGetSidebarState (): UseQueryResult<boolean, unknown> {
  return useQuery({
    queryKey: ['sidebar'],
    queryFn: () => sidebarState
  })
}

// Mutations:

export function useSidebarStateMut (): UseMutationResult<boolean, unknown, boolean, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newState) => {
      sidebarState = newState
      return await Promise.resolve(newState)
    },
    onSuccess: newState => {
      queryClient.setQueryData(['sidebar'], newState)
    }
  })
}
