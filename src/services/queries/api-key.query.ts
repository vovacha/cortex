import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { ApiKey, HasId, HasName } from '../../interfaces'
import { apiKeyStoreAPI } from '../api/store.service'

// Queries:

export function useGetApiKeys (): UseQueryResult<ApiKey[], unknown> {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => await apiKeyStoreAPI.getAll()
  })
}

export function useGetApiKey (id: string): UseQueryResult<ApiKey, unknown> {
  return useQuery({
    queryKey: ['api-keys', id],
    queryFn: async () => await apiKeyStoreAPI.get(id)
  })
}

// Mutations:

export function useCreateApiKeyMut (): UseMutationResult<ApiKey, unknown, Partial<ApiKey> & HasName, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialKey) => { return await apiKeyStoreAPI.create(partialKey) },
    onSuccess: async (newKey) => {
      queryClient.setQueryData(['api-keys', newKey.id], newKey)
      await queryClient.invalidateQueries(['api-keys'], { exact: true })
    }
  })
}

export function useUpdateApiKeyMut (): UseMutationResult<ApiKey, unknown, Partial<ApiKey> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialKey) => { return await apiKeyStoreAPI.update(partialKey) },
    onSuccess: updatedAccount => {
      queryClient.setQueryData(['api-keys', updatedAccount.id], updatedAccount)
    }
  })
}

export function useDeleteApiKeyMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await apiKeyStoreAPI.delete(id) },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['api-keys'], { exact: true })
    }
  })
}

export function useDeleteApiKeysMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await apiKeyStoreAPI.deleteAll() },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['api-keys'], { exact: true })
    }
  })
}
