import { JsonRpcProvider } from 'ethers'
import { type Chain, chains } from '.'

const providers = ['Ankr', 'Infura'] as const
export type Provider = typeof providers[number]

export function getJsonRpcProvider (provider: Provider, chain: Chain): JsonRpcProvider {
  if (provider === 'Ankr') {
    const API_KEY = import.meta.env.VITE_ANKR_API_KEY
    return new JsonRpcProvider(`https://rpc.ankr.com/${chain.ankr}/${API_KEY}`)
  // Infura
  } else {
    const API_KEY = import.meta.env.VITE_INFURA_API_KEY
    return new JsonRpcProvider(`https://TODO/${chain.infura}/${API_KEY}`)
  }
}

export function getDefaultRpcProvider (chainName: string): JsonRpcProvider | undefined {
  const chain = chains.find((c) => c.name === chainName)
  if (chain === undefined) {
    return undefined
  }
  return getJsonRpcProvider('Ankr', chain)
}
