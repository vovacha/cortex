export const chains = [
  { name: 'Ethereum', ankr: 'eth', infura: '' },
  { name: 'BNB Smart Chain', ankr: 'bsc', infura: '' },
  { name: 'Arbitrum', ankr: 'arbitrum', infura: '' },
  { name: 'Arbitrum Nova', ankr: 'arbitrumnova', infura: '' },
  { name: 'Polygon', ankr: 'polygon', infura: '' },
  { name: 'Optimism', ankr: 'optimism', infura: '' },
  { name: 'Avalanche', ankr: 'optimism', infura: '' },
  { name: 'zkSync Era', ankr: 'zksync_era', infura: '' }
] as const
export type Chain = typeof chains[number]
