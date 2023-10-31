import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { Group, HasId, HasName } from '../../interfaces'
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

export function useCreateAccountGroupMut (): UseMutationResult<Group, unknown, Partial<Group> & HasName, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialGroup) => { return await accountGroupStoreAPI.create(partialGroup) },
    onSuccess: async (newGroup) => {
      queryClient.setQueryData(['accountGroups', newGroup.id], newGroup)
      await queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}

export function useUpdateAccountGroupMut (): UseMutationResult<Group, unknown, Partial<Group> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialGroup) => { return await accountGroupStoreAPI.update(partialGroup) },
    onSuccess: async (updatedGroup) => {
      queryClient.setQueryData(['accountGroups', updatedGroup.id], updatedGroup)
      await queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}

export function useDeleteAccountGroupMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await accountGroupStoreAPI.delete(id) },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}

export function useDeleteAccountGroupsMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await accountGroupStoreAPI.deleteAll() },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['accountGroups'], { exact: true })
    }
  })
}
