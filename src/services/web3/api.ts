import { Wallet, Contract, formatUnits, parseUnits, parseEther, type JsonRpcProvider } from 'ethers'

import type { TransactionReceipt } from '@/interfaces'

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

interface Props {
  provider: JsonRpcProvider
  privateKey: string
  toAddress: string
  amount: number
  contractAddress: string
}

export async function sendNativeCurrency ({ provider, privateKey, toAddress, amount }: Omit<Props, 'contractAddress'>): Promise<TransactionReceipt> {
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

export async function sendToken ({ provider, privateKey, toAddress, amount, contractAddress }: Required<Props>): Promise<TransactionReceipt> {
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

export async function validateContract ({ provider, contractAddress }: Omit<Props, 'privateKey' | 'toAddress' | 'amount'>): Promise<boolean> {
  try {
    const code = await provider.getCode(contractAddress)
    if (code !== '0x') return true
  } catch (error) {}
  return false
}
