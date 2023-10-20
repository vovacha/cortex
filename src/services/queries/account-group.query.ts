import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { Group, HasId } from '../../interfaces'
import { accountGroupStoreAPI } from '../api/store.service'

// Queries:

export function useGetAccountGroups (): UseQueryResult<Group[], unknown> {
  return useQuery({
    queryKey: ['accountGroups'],
    queryFn: async () => await accountGroupStoreAPI.getAll()
  })
}

export function useGetAccountGroup (id: string): UseQueryResult<Group, unknown> {
  return useQuery({
    queryKey: ['accountGroups', id],
    queryFn: async () => await accountGroupStoreAPI.get(id)
  })
}

// Mutations:

export function useCreateAccountGroupMut (): UseMutationResult<Group, unknown, Partial<Group>, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await accountGroupStoreAPI.create(partialAccount) },
    onSuccess: newAccount => {
      queryClient.setQueryData(['accountGroups', newAccount.id], newAccount)
      queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}

export function useUpdateAccountGroupMut (): UseMutationResult<Group, unknown, Partial<Group> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await accountGroupStoreAPI.update(partialAccount) },
    onSuccess: updatedAccount => {
      queryClient.setQueryData(['accountGroups', updatedAccount.id], updatedAccount)
    }
  })
}

export function useDeleteAccountGroupMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await accountGroupStoreAPI.delete(id) },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}

export function useDeleteAccountGroupsMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await accountGroupStoreAPI.deleteAll() },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}
