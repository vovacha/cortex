import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { Wallet, HasId } from '../../interfaces'
import { walletStoreAPI } from '../api/store.service'

// Queries:

export function useGetWallets (): UseQueryResult<Wallet[], unknown> {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => await walletStoreAPI.getAll()
  })
}

export function useGetWallet (id: string): UseQueryResult<Wallet, unknown> {
  return useQuery({
    queryKey: ['wallets', id],
    queryFn: async () => await walletStoreAPI.get(id)
  })
}

// Mutations:

export function useCreateWalletMut (): UseMutationResult<Wallet, unknown, Partial<Wallet>, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await walletStoreAPI.create(partialAccount) },
    onSuccess: newAccount => {
      queryClient.setQueryData(['wallets', newAccount.id], newAccount)
      queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}

export function useUpdateWalletMut (): UseMutationResult<Wallet, unknown, Partial<Wallet> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialAccount) => { return await walletStoreAPI.update(partialAccount) },
    onSuccess: updatedAccount => {
      queryClient.setQueryData(['wallets', updatedAccount.id], updatedAccount)
    }
  })
}

export function useDeleteWalletMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await walletStoreAPI.delete(id) },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}

export function useDeleteWalletsMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await walletStoreAPI.deleteAll() },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}
