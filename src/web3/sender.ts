import { JsonRpcProvider, Wallet, Contract, formatUnits, parseUnits, parseEther } from 'ethers'

import type { TransactionReceipt } from '../types'

export const chainNames: any = {
  Ethereum: 'eth',
  'BNB Smart Chain': 'bsc',
  Arbitrum: 'arbitrum',
  'Arbitrum Nova': 'arbitrumnova',
  Polygon: 'polygon',
  Optimism: 'optimism',
  Avalanche: 'avalanche',
  'zkSync Era': 'zksync_era'
}

const ERC20ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)'
]

const WAIT_TX_TIMEOUT = 90000 // ms
const WAIT_TX_CONF = 1 // block confirmations

function getJsonRpcProvider (chain: string): JsonRpcProvider {
  const API_KEY = import.meta.env.VITE_ANKR_API_KEY
  return new JsonRpcProvider(`https://rpc.ankr.com/${chain}/${API_KEY}`)
}

export async function sendNativeCurrency (chain: string, privateKey: string, toAddress: string, amount: number): Promise<TransactionReceipt> {
  const provider = getJsonRpcProvider(chain)
  const wallet = new Wallet(privateKey)
  const signer = wallet.connect(provider)
  const balance = await provider.getBalance(wallet.address)
  const message: TransactionReceipt = { address: wallet.address, balance: formatUnits(balance, 18), amount: amount.toString() }
  try {
    const tx = await signer.sendTransaction({ to: toAddress, value: parseEther(amount.toString()) })
    const receipt = await tx.wait(WAIT_TX_CONF, WAIT_TX_TIMEOUT)
    if (receipt != null) {
      message.transactionHash = receipt.hash
      message.blockNumber = receipt.blockNumber
    }
  } catch (e: any) {
    message.errorCode = e.code
    message.errorReceipt = e.receipt
    // https://github.com/ethers-io/ethers.js/discussions/2772#discussioncomment-2319395
  }
  return message
}

export async function sendToken (chain: string, privateKey: string, toAddress: string, amount: number, contractAddress: string): Promise<TransactionReceipt> {
  const provider = getJsonRpcProvider(chain)
  const wallet = new Wallet(privateKey)
  const signer = wallet.connect(provider)
  const contract = new Contract(contractAddress, ERC20ABI, signer)
  const balance = await contract.balanceOf(wallet.address)
  const decimals = await contract.decimals()
  const tokensAmount = parseUnits(amount.toString(), decimals)

  const message: TransactionReceipt = { address: wallet.address, balance: formatUnits(balance, decimals), amount: amount.toString() }
  try {
    const tx = await contract.transfer(toAddress, tokensAmount)
    const receipt = await tx.wait(WAIT_TX_CONF, WAIT_TX_TIMEOUT)
    if (receipt != null) {
      message.transactionHash = receipt.hash
      message.blockNumber = receipt.blockNumber
    }
  } catch (e: any) {
    message.errorCode = e.code
    message.errorReceipt = e.receipt
    // https://github.com/ethers-io/ethers.js/discussions/2772#discussioncomment-2319395
  }
  return message
}

export async function validateContract (chain: string, address: string): Promise<boolean> {
  const provider = getJsonRpcProvider(chain)
  try {
    const code = await provider.getCode(address)
    if (code !== '0x') return true
  } catch (error) {}
  return false
}

export function privateKeyToWalletAddress (privateKey: string): string | undefined {
  try {
    return new Wallet(privateKey).address
  } catch (error) {}
}
