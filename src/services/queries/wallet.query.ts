import {
  useMutation, useQuery, useQueryClient,
  type UseMutationResult, type UseQueryResult
} from '@tanstack/react-query'
import type { Wallet, HasId, HasName } from '../../interfaces'
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

export function useCreateWalletMut (): UseMutationResult<Wallet, unknown, Partial<Wallet> & HasName, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialWallet) => { return await walletStoreAPI.create(partialWallet) },
    onSuccess: async (newWallet) => {
      queryClient.setQueryData(['wallets', newWallet.id], newWallet)
      await queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}

export function useUpdateWalletMut (): UseMutationResult<Wallet, unknown, Partial<Wallet> & HasId, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partialWallet) => { return await walletStoreAPI.update(partialWallet) },
    onSuccess: updatedWallet => {
      queryClient.setQueryData(['wallets', updatedWallet.id], updatedWallet)
    }
  })
}

export function useDeleteWalletMut (): UseMutationResult<void, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await walletStoreAPI.delete(id) },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}

export function useDeleteWalletsMut (): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => { await walletStoreAPI.deleteAll() },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['wallets'], { exact: true })
    }
  })
}
