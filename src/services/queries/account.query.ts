import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { Account, HasId, HasName } from '../../interfaces'
import { accountStoreAPI } from '../api/store.service'

// Queries:

export function useGetAccounts (): UseQueryResult<Account[], unknown> {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => await accountStoreAPI.getAll()
  })
}

export function useGetAccountsByGroup (groupId: string | undefined): UseQueryResult<Account[], unknown> {
  return useQuery({
    queryKey: ['accounts', 'group', groupId],
    queryFn: async () => {
      const accounts = await accountStoreAPI.getAll()
      return (groupId !== undefined)
        ? accounts.filter((a) => a.group === groupId ? a : null)
        : accounts
    }
  })
}

export function useGetAccount (id: string): UseQueryResult<Account, unknown> {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: async () => await accountStoreAPI.get(id)
  })
}

// Mutations:

export function useCreateAccountMut (): UseMutationResult<Account, unknown, Partial<Account> & HasName, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await accountStoreAPI.create(partialAccount) },
    onSuccess: async (newAccount) => {
      queryClient.setQueryData(['accounts', newAccount.id], newAccount)
      await queryClient.invalidateQueries(['accounts'], { exact: true })
    }
  })
}

export function useUpdateAccountMut (): UseMutationResult<Account, unknown, Partial<Account> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await accountStoreAPI.update(partialAccount) },
    onSuccess: async (updatedAccount) => {
      queryClient.setQueryData(['accounts', updatedAccount.id], updatedAccount)
      // await queryClient.invalidateQueries(['accounts'], { exact: true })
    }
  })
}

export function useDeleteAccountMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await accountStoreAPI.delete(id) },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['accounts'], { exact: true })
    }
  })
}

export function useDeleteAccountsMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await accountStoreAPI.deleteAll() },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['accounts'], { exact: true })
    }
  })
}
