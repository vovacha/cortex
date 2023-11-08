import { describe, expect, test } from '@jest/globals'
import { sendNativeCurrency, sendToken } from '../api'
import { type Chain, getJsonRpcProvider } from '..'

describe('crypto module', () => {
  test('sends native currency transaction', async () => {
    const chain: Chain = { name: 'Polygon', ankr: 'polygon', infura: '' }
    const provider = getJsonRpcProvider('Ankr', chain)
    const privateKey = '0x8dfad43ab3537a243c1c16d6b342aad6b5dc844ef597ea0601c5eb80508a8443'
    const toAddress = '0x3b9996c2fced08fb6ac0fe635a04c9d50abedb4c'
    const amount = 0.1
    const result = await sendNativeCurrency({ provider, privateKey, toAddress, amount })
    console.log(result)

    expect(result.blockNumber).toEqual(expect.anything())
  }, 60000)

  test('sends token transaction', async () => {
    const chain: Chain = { name: 'Polygon', ankr: 'polygon', infura: '' }
    const provider = getJsonRpcProvider('Ankr', chain)
    const privateKey = '0x8dfad43ab3537a243c1c16d6b342aad6b5dc844ef597ea0601c5eb80508a8443'
    const toAddress = '0x3b9996c2fced08fb6ac0fe635a04c9d50abedb4c'
    const amount = 0.1
    const USDCAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    const result = await sendToken({ provider, privateKey, toAddress, amount, contractAddress: USDCAddress })
    console.log(result)

    expect(result.blockNumber).toEqual(expect.anything())
  }, 60000)
})
